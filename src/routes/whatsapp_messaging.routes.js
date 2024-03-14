import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { sendMessage } from '../controllers/whatsapp.controller.js';

const router = express.Router();

router.post('/send-wa-message', asyncHandler(sendMessage));

export { router as whatsappRouter}