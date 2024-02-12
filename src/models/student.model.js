import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        default: ''
    },
    studentUID: {
        type: String,
        required: true,
        default: ''
    },
    isPresent: {
        type: Boolean,
        default: true
    },
    examDetails: {
        examName: {
            type: String,
            required: true
        },
        examDate: {
            type: Date,
            default: Date.now
        },
        examTime: {
            type: String,
            default: ''
        },
        floorNumber: {
            type: Number,
            required: true,
            default: 0,
        },
        roomNumber: {
            type: String,
            required: true,
            default: '',
        },
        seatNumber: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    answerScript: {
        expected: {
            type: Number,
            default: 1
        },
        actual: {
            type: Number,
            default: 1
        },
        remark: {
            type: String,
            default: ''
        }
    }

});

export const Student = mongoose.model("Student", studentSchema);