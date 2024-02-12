import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp: {
        type: Number,
        required: true,
        default: 0
    },
    expirationTime: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 2 * 60 * 1000), // Current time + 2 minutes
    },
    email: {
        type: String,
        required: true
    }

});

export const OTP = mongoose.model("otp", otpSchema);