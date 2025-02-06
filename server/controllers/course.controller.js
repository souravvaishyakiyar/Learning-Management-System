import {Course} from "../models/course.model.js";
import {deleteMediaFromCloudinary, uploadMedia} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category)
         return res.status(400).json({message: "Course Title and Course Category are required"});

        const course= await Course.create({
            courseTitle,
            category,
            creator: req.id
        });

        return res.status(201).json({course,
            message:"Course Created Successfully"
            
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
        
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId= req.id;
        const courses = await Course.find({creator: userId});

        if(!courses){
            return res.status(404).json({
                courses:[],
                message: "No courses found"
            });
        }
        return res.status(200).json({courses});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to get courses"});
        
    }

}
export const editCourse = async (req,res) => {
    try {
        const courseId = req.params.courseId;
        console.log(courseId);
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courseThumbnail = await uploadMedia(thumbnail.path);
            
        }

 
        const updateData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail:courseThumbnail?.secure_url};
        console.log(updateData);

        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}