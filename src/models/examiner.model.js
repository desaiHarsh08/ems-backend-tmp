import mongoose from "mongoose";

const examinerSchema = new mongoose.Schema(
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
            default: "EXAMINER"
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
        refreshToken: {
            type: String,
        },
        examId: {
            type: String,
        }
    }, 
    { timestamps: true}
);


export const Examiner = mongoose.model('Examiner', examinerSchema);