import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import Message from "../models/message.model.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const {senderName, subject, message} = req.body;

    if(!senderName || !subject || !message){
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    const myMessage = await Message.create({
        senderName,
        subject,
        message
    });

    res.status(201).json({
        success: true,
        message: "Message Send!",
        myMessage
    })
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const allMessages = await Message.find();
    res.status(200).json({
        success: true,
        allMessages
    })
})

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const message = await Message.findById(id)
    if(!message){
        return next(new ErrorHandler("Message not found", 404));
    }

    await message.deleteOne()

    res.status(201).json({
        success: true,
        message: "Message deleted!"
    })
})