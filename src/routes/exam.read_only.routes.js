import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createExamReadOnly, getExamReadOnly, getExamsReadOnlyByFloors, getExamsReadOnlyByRooms } from '../controllers/exam_read_only.controller.js';


const router = express.Router();

// ROUTE 1: Create an exam_read_only using POST "/api/exam_read_only/create". Login required
router.post('/create', authenticateUser, asyncHandler(createExamReadOnly));

// ROUTE 2: Get an exam_read_only using POST "/api/exam_read_only/get-exam-obj". Login required
router.post('/get-exam-obj',  authenticateUser, asyncHandler(getExamReadOnly));

// ROUTE 3: Get an exam_read_only -> floors using POST "/api/exam_read_only/get-exam-obj-floor". Login required
router.post('/get-exam-obj-floor',  authenticateUser, asyncHandler(getExamsReadOnlyByFloors));

// ROUTE 4: Get an exam_read_only -> rooms using POST "/api/exam_read_only/get-exam-obj-room". Login required
router.post('/get-exam-obj-room',  authenticateUser, asyncHandler(getExamsReadOnlyByRooms));


export { router as examReadOnlyRouter };