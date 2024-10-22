import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    timeline: {
        from: {
            type: String
        },
        to: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Timeline = mongoose.model("Timeline", timelineSchema)

export default Timeline;