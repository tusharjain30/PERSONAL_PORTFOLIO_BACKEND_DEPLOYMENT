import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    githubRepo: String,
    deployedLink: String,
    technologies: String,
    stack: String,
    deployed: String,
    projectBanner: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
});

const Project = mongoose.model("Project", projectSchema)

export default Project;