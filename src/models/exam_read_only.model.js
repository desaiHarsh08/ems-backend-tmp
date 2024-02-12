import mongoose from "mongoose";

const examReadOnlySchema = new mongoose.Schema({

    examName: {
        type: String,
        required: true,
    },
    examDate: {
        type: Date,
    },
    uniqueId: {
        type: String,
        required: true,
    },
});

export const ExamReadOnly = mongoose.model("exam_read_only", examReadOnlySchema);