import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: [true, "Sender name is required!"],
        minLength: [2, "Name must be contain at least 2 characters!"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required!"],
        minLength: [2, "Subject must be contain at least 2 characters!"]
    },
    message: {
        type: String,
        required: [true, "Message is required!"],
        minLength: [2, "Message must be contain at least 2 characters!"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Message = mongoose.model("Message", messageSchema)

export default Message;