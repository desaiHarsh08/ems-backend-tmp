import express from 'express';
import { body } from 'express-validator';
import asyncHandler from "../utils/asyncHandler.js";
import { createStudent, deleteStudent, getStudents, getStudentsByAllotmentRegister, getStudentsByNameAndDate, getStudentsStats, getStudentsStatsByNameAndDate, updateStudent } from '../controllers/student.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';

const router = express.Router();

// ROUTE 1: Create a student using POST "/api/student/create". Login required
router.post('/create', authenticateUser, asyncHandler(createStudent));

// ROUTE 2: Delete a student using POST "/api/student/delete". Login required
router.delete('/delete/:id', authenticateUser, asyncHandler(deleteStudent));

// ROUTE 3: Get students using POST "/api/student/get-students". Login required
router.post('/get-students', authenticateUser, asyncHandler(getStudents));

// ROUTE 4: Update the student using POST "/api/student/update-student". Login required
router.post('/update-student', authenticateUser, asyncHandler(updateStudent));

// ROUTE 5: Get the students using POST "/api/student/get-student-by-date-name". Login required
router.post('/get-student-by-date-name', authenticateUser, asyncHandler(getStudentsByNameAndDate));

// ROUTE 5: Get the students using POST "/api/student/get-student-by-date-name". Login required
router.get('/get-student-stats-recent', authenticateUser, asyncHandler(getStudentsStats));

// ROUTE 6: Get the students stats using POST "/api/student/get-student-stats-date-name". Login required
router.post('/get-student-stats-date-name', authenticateUser, asyncHandler(getStudentsStatsByNameAndDate));

// ROUTE 7: Get the students by allotment register using POST "/api/student/get-students-allotment-register". Login required
router.post('/get-students-allotment-register', authenticateUser, asyncHandler(getStudentsByAllotmentRegister));

export { router as studentRouter };