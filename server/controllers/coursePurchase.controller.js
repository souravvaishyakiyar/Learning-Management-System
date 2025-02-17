import Stripe from 'stripe'
import {Course} from '../models/course.model.js'
import {CoursePurchase} from '../models/coursePurchase.model.js'
import {Lecture} from '../models/lecture.model.js'
import {User} from '../models/user.model.js'



const stripe= new Stripe("sk_test_51Qt71tFlvLAqOKBeaPSGOhrjsXP114WtCeY5Sol22G5kEgfLMOORI8mXIhw9ara7kvLbUeLcoYHyMLfxzA3k8fyX00zUkDyEx7");


export const createCheckoutSession= async(req,res)=>{
    try {
        const userId=req.id;
        const {courseId}=req.body;

        const course=await Course.findById(courseId);

        if(!course)
        {
            return res.status(404).json({
                message:"Course Not Found"
            })
        }

        const newPurchase= new CoursePurchase({
            courseId,
            userId,
            amount:course.coursePrice,
            status:"pending"
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: course.courseTitle,
                    // images: [course.courseThumbnail],
                  },
                  unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
            cancel_url: `http://localhost:5173/course-detail/${courseId}`,
            metadata: {
              courseId: courseId,
              userId: userId,
            },
            shipping_address_collection: {
              allowed_countries: ["IN"], // Optionally restrict allowed countries
            },
          });
          
    if (!session.url) {
      
        return res
        
          .status(400)
          .json({ success: false, message: "Error while creating session" });
      }
  
      // Save the purchase record
      newPurchase.paymentId = session.id;
      await newPurchase.save();
  
      return res.status(200).json({
        success: true,
        url: session.url, // Return the Stripe checkout URL
      });
              

        
    } catch (error) {
        console.log(error)
    }

}

export const stripeWebhook = async (req, res) => {
    let event;
  
    try {
      const payloadString = JSON.stringify(req.body, null, 2);
      const secret ="whsec_21e41003e59c3dc6cf4714d1bf32573b1a74130ab1b9803611ab09807f5aeedc"
  
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
      });
  
      event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
      console.error("Webhook error:", error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }
  
    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
      console.log("check session complete is called");
  
      try {
        const session = event.data.object;
  
        const purchase = await CoursePurchase.findOne({
          paymentId: session.id,
        }).populate({ path: "courseId" });
  
        if (!purchase) {
          return res.status(404).json({ message: "Purchase not found" });
        }
  
        if (session.amount_total) {
          purchase.amount = session.amount_total / 100;
        }
        purchase.status = "completed";
  
        // Make all lectures visible by setting `isPreviewFree` to true
        if (purchase.courseId && purchase.courseId.lectures.length > 0) {
          await Lecture.updateMany(
            { _id: { $in: purchase.courseId.lectures } },
            { $set: { isPreviewFree: true } }
          );
        }
  
        await purchase.save();
  
        // Update user's enrolledCourses
        await User.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
          { new: true }
        );
  
        // Update course to add user ID to enrolledStudents
        await Course.findByIdAndUpdate(
          purchase.courseId._id,
          { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
          { new: true }
        );
      } catch (error) {
        console.error("Error handling event:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    res.status(200).send();
  };
