import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            default: "SUPPORT_STAFF"
        },
        phone: {
            type: String,
            required: true,

        },
        examName: {
            type: String,
            required: true,
        },
        examDate: {
            type: Date,
            default: Date.now
        },
        examTime: {
            type: String,
            required: true,
        },
        examId: {
            type: String,
        },
        refreshToken: {
            type: String,
        }
    }, 
    { timestamps: true}
);


export const SupportStaff = mongoose.model('SupportStaff', supportSchema);