import mongoose from "mongoose";

const examOCSchema = new mongoose.Schema(
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
            default: "EXAM_OC"
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


export const ExamOC = mongoose.model('Exam_OC', examOCSchema);