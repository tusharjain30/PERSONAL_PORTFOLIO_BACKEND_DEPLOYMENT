import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import Timeline from "../models/timeline.model.js";

export const timeline = catchAsyncErrors(async (req, res, next) => {
    const {title, description, from, to} = req.body;

    if(!title || !description){
        return next(new ErrorHandler("Title and Description is required!"))
    }

    const sendTimeline = await Timeline.create({
        title,
        description,
        timeline: {
            from,
            to
        }
    });

    res.status(201).json({
        success: true,
        message: "Timeline Created!",
        sendTimeline
    })
});

export const getAllTimelines = catchAsyncErrors(async (req, res, next) => {
    const timelines = await Timeline.find().sort({createdAt: -1});
    res.status(201).json({
        success: true,
        timelines
    })
});

export const deleteTimeline = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const timeline = await Timeline.findById(id);
    if(!timeline){
        return next(new ErrorHandler("Timeline not found", 404))
    }

    await timeline.deleteOne()

    res.status(200).json({
        success: true,
        message: "Timeline deleted!"
    })
})

