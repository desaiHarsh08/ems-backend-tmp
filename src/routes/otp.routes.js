import express from 'express';
import { body } from 'express-validator';
import asyncHandler from "../utils/asyncHandler.js";
import { generateOTP } from '../controllers/otp.controller.js';

const router = express.Router();

// ROUTE 1: Create a user using POST "/api/otp/generate". No login requires
router.post('/generate', [
    body('email', 'Enter a valid email').isEmail()
], asyncHandler(generateOTP));


export { router as otpRouter };