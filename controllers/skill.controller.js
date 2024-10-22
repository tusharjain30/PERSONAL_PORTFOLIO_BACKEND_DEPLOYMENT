import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary"
import Skill from "../models/skills.model.js";

export const createSkill = catchAsyncErrors(async (req, res, next) => {
    const {title, proficiency} = req.body;

    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Please provide SVG!", 400))
    }

    if(!title || !proficiency){
        return next(new ErrorHandler("Please provide Title & Proficiency!", 400))
    }

    const {svg} = req.files;

    const cloudinaryRes = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {
            folder: "Portfolio Skills SVG"
        }
    )

    if(!cloudinaryRes || cloudinaryRes.error){
        console.log("Cloudinary Error", cloudinary.error)
        return next(new ErrorHandler("Failed to upload svg to cloudinary!", 500))
    }

    const skill = await Skill.create({
        title,
        proficiency,
        svg: {
            public_id: cloudinaryRes.public_id,
            url: cloudinaryRes.secure_url
        }
    })

    res.status(201).json({
        success: true,
        message: "Skill Created!",
        skill
    })
});

export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
    const skills = await Skill.find();
    if(!skills){
        return next(new ErrorHandler("Skills not found!", 404))
    }

    res.status(200).json({
        success: true,
        skills
    })
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const { proficiency } = req.body;

    const skill = await Skill.findById(id)
    if(!skill){
        return next(new ErrorHandler("Skill not found!", 404));
    }

    if(!proficiency){
        return next(new ErrorHandler(
            "Please add a proficiency level", 400
        ))
    }

    const skillUpdated = await Skill.findByIdAndUpdate(id, {proficiency}, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Skill Updated!",
        skillUpdated
    })
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const skill = await Skill.findById(id)
    if(!skill){
        return next(new ErrorHandler("Skill not found", 404))
    }
    await cloudinary.uploader.destroy(skill.svg.public_id)
    await skill.deleteOne()

    res.status(200).json({
        success: true,
        message: "Skill Deleted!"
    })
});