import { ExamOC } from "../models/exam_oc.model.js";
import { Examiner } from "../models/examiner.model.js";
import { Invigilator } from "../models/invigilator.model.js";
import { OTP } from "../models/otp.model.js";
import { SupportStaff } from "../models/support_staff.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";


const sendOTP = async (recipientEmail, otp, username) => {
    const subject = `One-Time Password (OTP) for Exam Management Software Verification`;
    const body = `Dear ${username},\n\nWe hope this email finds you well. As part of our commitment to ensuring the security of your account and maintaining the integrity of our exam management software, we require you to verify your email address.\n\nTo proceed with the verification process, please use the following One-Time Password (OTP):\n\nOTP: ${otp}\n\nPlease enter this code within the next [2 minutes] to confirm your email address and complete the verification.\n\nThank you for your cooperation and commitment to maintaining a secure exam environment.\n\nBest regards,\n\nExam Management Software`;
    const response = await fetch(`http://13.235.168.107:5001/send_mail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            toEmail: recipientEmail,
            subject,
            body
        })
    });
    console.log(await response.json())
}

export const generateOTP = async (req, res) => {
    try {
        console.log(req.body.email)
        const userTypes = [User, Invigilator, SupportStaff, Examiner, ExamOC];
        let user;

        for (const userType of userTypes) {
            user = await userType.findOne({ email: req.body.email });
            if (user) break;
        }

        if (!user) {
            return res.status(401).json(new ApiResponse(400, req.body, "USER NOT EXIST...!"));
        }



        // Generate a random 7-digit number
        const otp = Math.floor(1000000 + Math.random() * 9000000);

        const otpObject = await OTP.create({
            otp: otp,
            expirationTime: new Date(Date.now() + 2 * 60 * 1000),
            email: user.email
        })

        // const recipientNumber = user.phone;
        // console.log(recipientNumber)
        sendOTP(user.email, otp, user.username);

        return res.status(201).json(new ApiResponse(201, otpObject, "Generated OTP...!"));


    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "OTP CANNOT BE GENERATED...!", error
        ));
    }
}


export const verifyOTP = async (otp, email) => {
    try {
        const otpObject = await OTP.findOne({ email, otp });
        console.log("otp in verify", otp);
        console.log(otpObject);
        if (otpObject.otp == otp && otpObject.email === email) {
            if (new Date() <= otpObject.expirationTime) {
                return 1; // Valid OTP
            }
            return -1; // Expired OTP
        }
        else {
            return 0; // Invalid OTP
        }

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "OTP CANNOT BE VERIFIED...!", error
        ));
    }
}