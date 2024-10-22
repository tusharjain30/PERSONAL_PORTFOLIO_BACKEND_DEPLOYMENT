import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "FullName field is required!"]
    },
    email: {
        type: String,
        required: [true, "Email field is required!"]
    },
    password: {
        type: String,
        select: false,
        required: [true, "Password field is required!"],
        minLength: [6, "Password must contain at least 6 characters!"]
    },
    phone: {
        type: String,
        required: [true, "Mobile number is required!"],
        minLength: [10, "Mobile number must contain only 10 digits!"],
        maxLength: [10, "Mobile number must contain only 10 digits!"]
    },
    aboutMe: {
        type: String,
        required: [true, "AboutMe section is required!"]
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    portfolioURL: String,
    githubURL: String,
    instagramURL: String,
    facebookURL: String,
    linkedinURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIREIN
    })
};

userSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString("hex")
    
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken
};

const User = mongoose.model("User", userSchema)

export default User;