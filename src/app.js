import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse, ApiError, asyncHandler } from "./utils/index.js";
import { userRouter } from "./routes/user.routes.js";
import { otpRouter } from "./routes/otp.routes.js";
import { examRouter } from "./routes/exam.routes.js";
import { studentRouter } from "./routes/student.routes.js";
import { examReadOnlyRouter } from "./routes/exam.read_only.routes.js";
import { commonRolesAssignRouter } from "./routes/common_roles_assign.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


// Available Routes

app.use('/api/auth', userRouter);
app.use('/api/otp', otpRouter);
app.use('/api/exam', examRouter);
app.use('/api/student', studentRouter);
app.use('/api/exam_read_only', examReadOnlyRouter);
app.use('/api/common_role_assign', commonRolesAssignRouter);
// app.use('/', (req, res) => { // Default route
//     res.status(200).json(new ApiResponse(
//         200, 
//         { author: "HARSH NILESH DESAI", version: "2.0.1", lastUpdated: "31-01-2024" }, 
//         "exam-management-backend is live and running..."
//     ));
// });



export default app;