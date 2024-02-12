import express from 'express';
import { body } from 'express-validator';
import { createUser, deleteUser, loginUser, updateUser } from '../controllers/user.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';

const router = express.Router();

// ROUTE 1: Create an user using POST "/api/auth/create". No login requires
router.post('/create', [
    body('username', 'Enter a valid username').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('userType', 'Enter a valid user type').exists(),
], asyncHandler(createUser));

// ROUTE 2: Login an user using POST "/api/auth/login". No login requires
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('otp', 'Enter a valid otp').exists(),
], asyncHandler(loginUser));

// ROUTE 3: Update an user using POST "/api/auth/update/id". Login requires
router.delete('/delete/:id', [
    body('username', 'Enter a valid username').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('userType', 'Enter a valid user type').exists(),
], authenticateUser, asyncHandler(updateUser));

// ROUTE 4: Delete an user using POST "/api/auth/delete/id". Login requires
router.delete('/delete/:id', [
    body('email', 'Enter a valid email').isEmail()
], authenticateUser, asyncHandler(deleteUser));


export { router as userRouter };