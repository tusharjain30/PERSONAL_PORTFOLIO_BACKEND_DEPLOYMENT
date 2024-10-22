import User from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";
import sendToken from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = catchAsyncErrors(async(req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Avatar & Resume is required!", 400))
    }

    const {avatar, resume} = req.files;

    const {
        fullName,
        email,
        password,
        phone,
        aboutMe,
        githubURL,
        instagramURL,
        facebookURL,
        linkedinURL,
        portfolioURL
    } = req.body;

    if(!fullName || !email || !password || !phone || !aboutMe){
        return next(new ErrorHandler("FullName, Email, Password, Phone and AboutMe section is required", 400))
    }

    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {folder: "Portfolio  Avatar"}
    )

    if(!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error){
        console.log("Cloudinary Error:", cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error")
        return next(new ErrorHandler("Failed to upload avatar to cloudinary", 500))
    }

    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {folder: "Portfolio  Resume"}
    )

    if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error){
        console.log("Cloudinary Error:", cloudinaryResponseForResume.error || "Unknown Cloudinary Error")
        return next(new ErrorHandler("Failed to upload Resume to cloudinary", 500))
    }

    const user = await User.create({
        fullName,
        email,
        password,
        phone,
        aboutMe,
        githubURL,
        instagramURL,
        facebookURL,
        linkedinURL,
        portfolioURL,
        avatar: {
            public_id: cloudinaryResponseForAvatar.public_id,
            url: cloudinaryResponseForAvatar.secure_url
        },
        resume: {
            public_id: cloudinaryResponseForResume.public_id,
            url: cloudinaryResponseForResume.secure_url
        }
    })

    sendToken(user, "User Registered!", res, 201)
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please provide both email and password!", 400))
    }

    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password!", 400))
    }

    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password!", 400))
    }
    sendToken(user, "User loggedIn!", res, 200)
})

export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }).json({
        success: true,
        message: "User logged out!"
    })
})

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const id = req.user._id;
    const user = await User.findById(id)
    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }
    res.status(200).json({
        success: true,
        user
    })
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
    const id = "66c588ba59648eba43584f74"
    const user = await User.findById(id)
    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }
    res.status(200).json({
        success: true,
        user
    })

})

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const {currentPassword, newPassword, confirmNewPassword} = req.body;

    const user = await User.findById(req.user._id).select("+password")
    if(!user){
        return next(new ErrorHandler("User not found!", 404))
    }
    if(!currentPassword || !newPassword || !confirmNewPassword){
        return next(new ErrorHandler("Please provide all fields", 400));
    }

    const isPasswordMatched = await user.comparePassword(currentPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Incorrect current password!", 400))
    }

    if(newPassword !== confirmNewPassword){
        return next(new ErrorHandler("NewPassword or Confirm Password do not match!"));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Updated!"
    })
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        facebookURL: req.body.facebookURL,
        linkedinURL: req.body.linkedinURL,
        portfolioURL: req.body.portfolioURL
    }

    if(req.files && req.files.avatar){
        const avatar = req.files.avatar
        const user = await User.findById(req.user._id)
        const publicId = user.avatar.public_id
        await cloudinary.uploader.destroy(publicId)
        const uploadNewAvatar = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {
                folder: "Portfolio Avatar"
            }
        )
        if(!uploadNewAvatar || uploadNewAvatar.error){
            return next(new ErrorHandler("failed to upload Avatar to cloudinary!", 500))
        }

        newUserData.avatar = {
            public_id: uploadNewAvatar.public_id,
            url: uploadNewAvatar.secure_url
        }
    }

    if(req.files && req.files.resume){
        const resume = req.files.resume
        const user = await User.findById(req.user._id)
        const publicId = user.resume.public_id
        await cloudinary.uploader.destroy(publicId)
        const uploadNewResume = await cloudinary.uploader.upload(
            resume.tempFilePath,
            {
                folder: "Portfolio Resume"
            }
        )
        if(!uploadNewResume || uploadNewResume.error){
            return next(new ErrorHandler("failed to upload Resume to cloudinary!", 500))
        }

        newUserData.resume = {
            public_id: uploadNewResume.public_id,
            url: uploadNewResume.secure_url
        }
    }

    const updatedUserProfile = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "User Profile Updated!",
        updatedUserProfile
    })
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const {email} = req.body;
    if(!email){
        return next(new ErrorHandler("Please provide email!", 400))
    }
    const user = await User.findOne({email})
    if(!user){
        return next(new ErrorHandler("User Not Found!", 404))
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})
    const resetPasswordURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`
    const message = `Your Reset Password URL & Token is: \n\n ${resetPasswordURL} \n\n If you've not request for this, please ignore it.`

    try{

        await sendEmail({
            email,
            subject: "PERSONAL PORTFOLIO DASHBOARD RECOVERY PASSWORD",
            message
        })

        res.status(200).json({
            success: true,
            message: `Mail sent to ${email} successfully!`
        })

    }catch(err){
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        console.log("Forgot Password:", err)
        return next(new ErrorHandler(`Failed to sent mail to ${email}`, 500))
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.params
    const {password, confirmPassword} = req.body;

    if(!password || !confirmPassword){
        return next(new ErrorHandler("Please provide password and confirmPassword!"))
    }

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
    let user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    }).select("+password")

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired!", 400))
    }

    if(password !== confirmPassword){
        return next(new ErrorHandler("Password or Confirm password do not match!", 400))
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    sendToken(user, "Password Updated!", res, 200)
});