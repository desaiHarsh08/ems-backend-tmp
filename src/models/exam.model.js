import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    floorNumber: {
        type: Number,
        required: true
    },
    rooms: [
        {
            roomNumber: {
                type: String,
                required: true
            },
            seatsArr: [],
            answerScript: {
                expected: {
                    type: Number,
                },
                actual: {
                    type: Number,
                },
                remark: {
                    type: String,
                    default: ''
                }
            }
        }
    ]
})

const examSchema = new mongoose.Schema(
    {
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
        examLocations: [locationSchema],
        isAnswerScriptCollecionDone: {
            type: Boolean,
            default: false
        },
        isAnswerScriptAllotmentDone: {
            type: Boolean,
            default: false
        },
        isAnswerScriptMarksAssignmentDone: {
            type: Boolean,
            default: false
        },
        
    },
    {
        timestamps: true
    }
);

export const Exam = mongoose.model("Exam", examSchema);