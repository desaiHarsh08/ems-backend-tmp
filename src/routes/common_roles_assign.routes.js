import express from 'express';
import { body } from 'express-validator';
import asyncHandler from "../utils/asyncHandler.js";
import { createRoleForUser, getByRole, updateTheRoleForAUser, getUsersExamsId, deleteRoleForAUser, updateExaminerFromToTotalField, getByRoleAndExamNameAndDate, updateExaminerWorkprogressDC, updateExaminerWorkprogressMU, examinerWorkprogress } from '../controllers/common_roles_assign.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';

const router = express.Router();

// ROUTE 1: Assign a role to a user using POST "/api/common_role_assign/create". Login required
router.post('/create', [
    body('username', 'Enter a valid username').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('userType', 'Enter a valid userType').exists()
], authenticateUser, asyncHandler(createRoleForUser));

// ROUTE 2: Get by users role using POST "/api/common_role_assign/get-by-role". Login required
router.post('/get-by-role', [
    body('userType', 'Enter a valid userType').exists()
], authenticateUser, asyncHandler(getByRole));

// ROUTE 3: Update the users role using PUT "/api/common_role_assign/update". Login required
router.put('/update', [
    body('userType', 'Enter a valid userType').exists(),
    body('emal', 'Enter a valid email').isEmail()
], authenticateUser, asyncHandler(updateTheRoleForAUser));

// ROUTE 4: Delete the user role using PUT "/api/common_role_assign/update". Login required
router.delete('/delete', [
    body('userType', 'Enter a valid userType').exists(),
    body('_id', 'Enter a valid _id').isEmail()
], authenticateUser, asyncHandler(deleteRoleForAUser));

// ROUTE 5: Get by users role, examName, examDate using POST "/api/common_role_assign/get-by-role-name-date". Login required
router.post('/get-by-role-name-date', [
    body('userType', 'Enter a valid userType').exists()
], authenticateUser, asyncHandler(getByRoleAndExamNameAndDate));

// ROUTE 6: Get by users role, examId using POST "/api/common_role_assign/user-examID". Login required
router.post('/user-examId', authenticateUser, asyncHandler(getUsersExamsId));

// ROUTE 7: Set the from, to, and total for examiner using POST "/api/common_role_assign/updated-examiner". Login required
router.post('/updated-examiner', authenticateUser, asyncHandler(updateExaminerFromToTotalField));

// ROUTE 8: Set the dc for examiner using POST "/api/common_role_assign/workprogress-dc". Login required
router.post('/workprogress-dc', authenticateUser, asyncHandler(updateExaminerWorkprogressDC));
// ROUTE 9: Set the dc for examiner using POST "/api/common_role_assign/workprogress-mu". Login required
router.post('/workprogress-mu', authenticateUser, asyncHandler(updateExaminerWorkprogressMU));
// ROUTE 9: Get the dc for examiner using POST "/api/common_role_assign/workprogress". Login required
router.post('/workprogress', authenticateUser, asyncHandler(examinerWorkprogress));


export { router as commonRolesAssignRouter };