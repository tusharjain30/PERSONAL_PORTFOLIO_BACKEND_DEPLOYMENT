import mongoose from "mongoose";

const softwareAppSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "App Name is required!"]
    },
    svg: {
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    }
});

const SoftwareApp = mongoose.model("Application", softwareAppSchema)

export default SoftwareApp;