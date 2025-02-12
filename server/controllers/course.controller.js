import {Course} from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia} from "../utils/cloudinary.js";

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
        
        const {courseTitle, subTitle,  description,category, courseLevel, coursePrice} = req.body;
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

 
        const updateData = {courseTitle, subTitle,  description,category, courseLevel, coursePrice, courseThumbnail:courseThumbnail?.secure_url};
  

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
export const getCourseById= async (req,res)=>{
    try {
        const {courseId}=req.params;

        const course= await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({course});  

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course"
        })
    }
}

export const createLecture= async(req,res)=>{
    try {
        const {lectureTitle}=req.body;
        const {courseId}=req.params;

        if(!lectureTitle||!courseId)
        {
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };

        const lecture= await Lecture.create({
            lectureTitle
        })
        const course= await Course.findById(courseId)
        if(course){
            course.lectures.push(lecture._id)
            await course.save()
        }
        return res.status(201).json({
            lecture,
            message:"Lecture created sucessfully"
        })
        
    } catch (error) {
        console.log(error)
       return res.status(500).json({
        message:"Failed to create Lectue"
       })
        
    }
}

export const getCourseLecture= async(req,res)=>{
try {
    const {courseId}= req.params;
    const course= await Course.findById(courseId).populate("lectures")
    if(!course){
        return res.status(404).json({
            message:"Course not found"
        })
       
    }
    return res.status(200).json({
            
        lectures:course.lectures
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message:"Failed to get lecture"
    })
}
}

export const editLecture= async(req,res)=>{
    try {
        const {lectureTitle,videoInfo, isPreviewFree}=req.body;
        const {courseId, lectureId}=req.params;

        const lecture=await Lecture.findById(lectureId)

        if(!lecture)
        {
            return res.status(404).json({
                message:"Lecture Not Found"
            })
        }
        if(lectureTitle)
        {
            lecture.lectureTitle=lectureTitle;

        }
        if(videoInfo?.videoUrl)lecture.videoUrl=videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId=videoInfo.publicId;
        lecture.isPreviewFree= isPreviewFree;

        await lecture.save();

        const course=await Course.findById(courseId)

        if(course&& !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save()
        }
        return res.status(200).json({
            lecture,
            message:"Lecture Updated successfully"
        })



        
    } catch (error) {
        console.log(error)
    return res.status(500).json({
        message:"Failed to edit lecture"
    })
    }
}

export const removeLecture= async(req,res)=>{
    try {
        const {lectureId}=req.params;
        const lecture=await Lecture.findByIdAndDelete(lectureId)

        if(!lecture)
        {
            return res.status(401).json({
                message:"Lecture not found"
            })
        }
        if(lecture.publicId)
        {
            await deleteVideoFromCloudinary(lecture.publicId)
        }
        await Course.updateOne(
            {lectures:lectureId},
            {$pull:{lectures:lectureId}}
        )

        return res.status(200).json({
            message:"Lecture Removed Successfully"
        })


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}

export const getLectureById=async(req,res)=>{
    try {
        const {lectureId}=req.params;
        const lecture= await Lecture.findById(lectureId);
        if(!lecture)
        {
            return res.status(404).json({
                message:"Lecture Not found"
            })
        }
        return res.status(200).json({
            lecture
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to get lecture"
        })
    }
}

export const togglePublishCourse= async(req,res)=>{
    try {
        const {courseId}=req.params;
        const {publish}=req.query;
       

        const course= await Course.findById(courseId);
        if(!course)
            {
                return res.status(404).json({
                    message:"Course Not found"
                })
            }

            course.isPublished=publish==="true"

            await course.save();
            const statusMessage= course.isPublished?"Published":"Unpublished"
            return res.status(200).json({
                message:`Course is ${statusMessage}`    
            })


    } catch (error) {
          console.log(error)
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
    
}
export const removeCourse=async(req,res)=>{
    try {
        const {courseId}=req.params;
    const course=await Course.findByIdAndDelete(courseId);
    if(!course)
    {
        return res.status(401).json({
            message:"Course Not Found "
        })
    }

    return res.status(200).json({
        message:"Course has been removed successfully"
    })
    } catch (error) {
        
    }
}



