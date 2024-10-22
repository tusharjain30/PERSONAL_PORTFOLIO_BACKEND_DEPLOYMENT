import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";
import Project from "../models/project.model.js";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
    const {
        title,
        description,
        githubRepo,
        deployedLink,
        technologies,
        stack,
        deployed
    } = req.body;

    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Please provide a project banner!", 400))
    }

    if(
        !title ||
        !description ||
        !githubRepo ||
        !deployedLink ||
        !technologies ||
        !stack ||
        !deployed
    ){
        return next(new ErrorHandler("Please provide all fields!", 400))
    }

    const {projectBanner} = req.files;

    const projectBannerURL = await cloudinary.uploader.upload(
        projectBanner.tempFilePath,
        {
            folder: "Portfolio Project Image"
        }
    )

    if(!projectBannerURL || projectBannerURL.error){
        console.log(
            "Cloudinary Error: ", projectBannerURL.error
        )
        return next(new ErrorHandler("Failed to upload Project Banner to cloudinary!", 500))
    }

    const project = await Project.create({
        title,
        description,
        githubRepo,
        deployedLink,
        technologies,
        stack,
        deployed,
        projectBanner: {
            public_id: projectBannerURL.public_id,
            url: projectBannerURL.secure_url
        }
    })

    res.status(201).json({
        success: true,
        message: "Project Created!",
        project
    })
});

export const updateProject = catchAsyncErrors(async (req, res, next) => {

    const {
        title,
        description,
        githubRepo,
        deployedLink,
        technologies,
        stack,
        deployed
    } = req.body;

    if(
        !title ||
        !description ||
        !githubRepo ||
        !deployedLink ||
        !technologies ||
        !stack ||
        !deployed
    ){
        return next(new ErrorHandler("Please provide all fields!", 400))
    }

    const newProjectData = {
        title: req.body.title,
        description: req.body.description,
        githubRepo: req.body.githubRepo,
        deployedLink: req.body.deployedLink,
        technologies: req.body.technologies,
        stack: req.body.stack,
        deployed: req.body.deployed
    }

    if(req.files && req.files.projectBanner){
        const {projectBanner} = req.files;
        const project = await Project.findById(req.params.id)
        const public_id = project.projectBanner.public_id
        await cloudinary.uploader.destroy(public_id)

        const cloudResponse = await cloudinary.uploader.upload(
            projectBanner.tempFilePath,
            {
                folder: "Portfolio Project Image"
            }
        )

        if(!cloudResponse || cloudResponse.error){
            console.log("Cloudinary Error: ", cloudResponse.error)
            return next(new ErrorHandler("Failed to upload Project Banner to cloudinary!", 500))
        }

        newProjectData.projectBanner = {
            public_id: cloudResponse.public_id,
            url: cloudResponse.url
        }
    }

    const updatedProjectData = await Project.findByIdAndUpdate(req.params.id, newProjectData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Project Updated!",
        updatedProjectData
    })
});

export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
    const projects = await Project.find()
    if(!projects){
        return next(new ErrorHandler("Projects not found!", 404))
    }

    res.status(200).json({
        success: true,
        projects
    })
});

export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params
    const project = await Project.findById(id)
    if(!project){
        return next(new ErrorHandler("Project not found", 404))
    }

    res.status(200).json({
        success: true,
        project
    })
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params
    const project = await Project.findById(id)
    if(!project){
        return next(new ErrorHandler("Project not found", 404))
    }

   await cloudinary.uploader.destroy(project.projectBanner.public_id)
   await project.deleteOne()

   res.status(200).json({
    success: true,
    message: "Project Deleted!"
   })
});