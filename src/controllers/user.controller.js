import { ExamOC } from "../models/exam_oc.model.js";
import { Examiner } from "../models/examiner.model.js";
import { Invigilator } from "../models/invigilator.model.js";
import { SupportStaff } from "../models/support_staff.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { verifyOTP } from "./otp.controller.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    try {
        const { username, email, userType } = req.body;

        // Return if user already exist
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (existingUser != null) {
            console.log('in exists user')
            return res.status(400).json(new ApiResponse(400, req.body, "USER ALREADY EXIST!"));
        }

        const user = await User.create({
            username: username,
            email: email,
            userType: userType
        });

        return res.status(200).json(new ApiResponse(400, user, "USER CREATED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "USER CANNOT BE CREATED...!", error
        ));
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(req.body)
        const status = await verifyOTP(otp, email);

        console.log("Status: ", status);

        if (status < 0) { // Expired OTP
            return res.status(401).json(new ApiResponse(401, status, "OTP GOT EXPIRED!"));
        }
        else if (status === 0) { // Invalid OTP
            return res.status(401).json(new ApiResponse(401, status, "INVALID OTP!"));
        }
        else if (status > 0) { //Valid OTP

            const userTypes = [User, Invigilator, SupportStaff, Examiner, ExamOC];
            let user;
            let tmpArr = [];
            let examIds = [];
            for (let i = 0; i < userTypes.length; i++) {
                if(i == 0) {
                    user = await userTypes[i].findOne({ email: req.body.email });
                }
                else {
                    const date = new Date()
                    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}T00:00:00.000Z`
                    console.log("formattedDate:", formattedDate)
                    tmpArr = await userTypes[i].find({email: req.body.email, examDate: formattedDate});
                    console.log(tmpArr)
                    for(let j = 0; j < tmpArr.length; j++) {
                        console.log('in loop:', tmpArr[j].examId);
                        examIds.push(tmpArr[j].examId);
                    }
                    user = tmpArr[0];
                    console.log(user);
                    console.log("exam ids:", examIds)
                }

                if (user) break;

            }

            const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY_TIME });
            user.refreshToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME });


            await user.save();

            return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken: user.refreshToken, user, examIds }, "LOGGED IN...!"));

        }

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "CANNOT BE LOGGED IN...!", error
        ));
    }
}

export const updateUser = async (req, res) => {
    try {

    } catch (error) {
        return res.status(error.code || 500).json(new ApiError(
            error.code, "CANNOT UPDATE THE USER...!", error
        ));
    }
}

export const deleteUser = async (req, res) => {
    try {

    } catch (error) {
        return res.status(error.code || 500).json(new ApiError(
            error.code, "CANNOT DELETE THE USER...!", error
        ));
    }
}