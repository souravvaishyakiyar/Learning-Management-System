import {Course} from "../models/course.model.js";

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