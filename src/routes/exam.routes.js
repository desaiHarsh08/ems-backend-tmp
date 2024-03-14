import express from "express";
import { body } from 'express-validator';
import asyncHandler from "../utils/asyncHandler.js";
import { createExam, deleteExam, getAllExam, getExam, getExamByNameAndDate, recentAndUpcomingExam, updateExam } from "../controllers/exam.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";


const router = express.Router();

// ROUTE 1: Create an exam | METHOD: 'POST' | URL: 'exam/create' | LOGIN: Required
router.post('/create', [
    body('examName', 'Enter a valid examName').isLength({min: 3}),
    body('examDate', 'Enter a valid examDate').exists(),
    body('examTime', 'Enter a valid time').exists(),
], authenticateUser, asyncHandler(createExam));

// ROUTE 2: Delete an exam | METHOD: 'DELETE' | URL: 'exam/delete' | LOGIN: Required
router.post('/delete/:id', authenticateUser, asyncHandler(deleteExam));

// ROUTE 3: Get an exam | METHOD: 'GET' | URL: 'exam/get/:id' | LOGIN: Required
router.get('/get-exam/:id', authenticateUser, asyncHandler(getExam));

// ROUTE 3: Get recent and upcoming exams | METHOD: 'GET' | URL: '/api/exam/recent-upcoming-exams' | LOGIN: Required
router.get('/recent-upcoming-exams', authenticateUser, asyncHandler(recentAndUpcomingExam));

// ROUTE 4: Get an exam by name and date | METHOD: 'GET' | URL: '/api/exam/get-by-name-date' | LOGIN: Required
router.post('/get-by-name-date', authenticateUser, asyncHandler(getExamByNameAndDate));

// ROUTE 5: Update the exam | METHOD: 'GET' | URL: '/api/exam/get-by-name-date' | LOGIN: Required
router.post('/update/:id', authenticateUser, asyncHandler(updateExam));

// ROUTE 6: Get all exams | METHOD: 'GET' | URL: '/api/exam/get-all' | LOGIN: Required
router.get('/get-all', authenticateUser, asyncHandler(getAllExam));


export {router as examRouter};