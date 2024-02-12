import mongoose from "mongoose";

const invigilatorSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            default: '',
       
        },
        userType: {
            type: String,
            default: "INVIGILATOR"
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
        roomNumber: {
            type: String,
            required: true,
            default: ''
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


export const Invigilator = mongoose.model('Invigilators', invigilatorSchema);