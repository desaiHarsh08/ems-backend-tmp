import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        userType: {
            type: String,
            required: true,
            default: "INVIGILATOR"
            // ROLES: ADMIN, EXAM_OC, INVIGILATOR, SUPPORT_STAFF, EXAMINER
        },
        refreshToken: {
            type: String,
        }
    }, 
    { timestamps: true}
);


export const User = mongoose.model('User', userSchema);