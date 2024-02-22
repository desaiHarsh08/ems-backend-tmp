import { ExamOC } from "../models/exam_oc.model.js";
import { Examiner } from "../models/examiner.model.js";
import { Invigilator } from "../models/invigilator.model.js";
import { OTP } from "../models/otp.model.js";
import { SupportStaff } from "../models/support_staff.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import fetch from "node-fetch"


const sendOTP = async (recipientEmail, otp, username) => {
    const response = await fetch(`${process.env.EMAIL_API_URL}/send-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, recipientEmail, otp })
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

        const recipientNumber = user.phone;
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