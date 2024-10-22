import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import SoftwareApp from "../models/softwareApplication.model.js";
import cloudinary from "cloudinary";

export const createApplication = catchAsyncErrors(async (req, res, next) => {
    if(!req.body.name){
        return next(new ErrorHandler("App name is required!", 400))
    }

    if(!req.files){
        return next(new ErrorHandler("App svg is required!", 400))
    }

    const { name } = req.body;
    const { svg } = req.files;

    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {
            folder: "Portfolio App"
        }
    )

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error: ", cloudinaryResponse.error)
        return next(new ErrorHandler("Failed to upload app svg to cloudinary!"))
    }

    const app = await SoftwareApp.create({
        name,
        svg: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    })

    res.status(201).json({
        success: true,
        message: "SoftwareApp created!",
        app
    })
});

export const getAllApps = catchAsyncErrors(async (req, res, next) => {
    const applications = await SoftwareApp.find();
    res.status(200).json({
        success: true,
        applications
    })
});

export const deleteApp = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const app = await SoftwareApp.findById(id)
    if(!app){
        return next(new ErrorHandler("App not found!", 404))
    }

    await cloudinary.uploader.destroy(app.svg.public_id);

    await app.deleteOne()

    res.status(200).json({
        success: true,
        message: "Software App deleted!"
    })
});