
import { ExamOC } from "../models/exam_oc.model.js";
import { Examiner } from "../models/examiner.model.js";
import { Invigilator } from "../models/invigilator.model.js";
import { SupportStaff } from "../models/support_staff.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const senEmail = async (recipientEmail, subject, body) => {
    const response = await fetch(`${process.env.EMAIL_API_URL}/send-email-v2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientEmail, subject, body })
    });
    // console.log(await response.json())
}

export const createRoleForUser = async (req, res) => {
    try {
        const { username, email, userType, phone, examName, examDate, examTime, examId, roomNumber, from, to, total } = req.body;
  

        let roleObjAssigned;
        if (userType === "INVIGILATOR") {
            console.log("in invig")
            roleObjAssigned = await Invigilator.create({ username, email, userType, phone, examName, examDate, examTime, examId, roomNumber });
        }
        else if (userType === "EXAM_OC") {
            roleObjAssigned = await ExamOC.create({ username, email, userType, phone, examName, examDate, examId, examTime });
        }
        else if (userType === "EXAMINER") {
            roleObjAssigned = await Examiner.create({ username, email, userType, phone, examName, examDate, examId, examTime, from, to, total });
        }
        else if (userType === "SUPPORT_STAFF") {
            roleObjAssigned = await SupportStaff.create({ username, email, userType, phone, examName, examDate, examId, examTime });
        }
        const date = new Date(examDate);
        const formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
        
        const subject = `Assignment as ${userType} for Exam: ${examName} on ${formattedDate}`;
        const body = `Dear ${username},\n\nWe hope this message finds you well. We are pleased to inform you that you have been assigned the role of ${userType} for the upcoming exam: ${examName}, scheduled to take place on ${formattedDate}.\n\nYour dedication and commitment to ensuring a smooth examination process are highly valued, and we trust that your involvement will contribute to the success of this event.\n\nDetails of the Exam:\n\nExam Name: ${examName}\nExam Date: ${formattedDate}\n\nYour Assigned Role: ${userType}\n\nWe appreciate your cooperation and adherence to the assigned responsibilities. Should you have any queries or require further information, please do not hesitate to contact us.\n\nThank you for your commitment to maintaining the integrity of the examination process. We wish you a successful and smooth experience as an ${userType} for ${examName}.\n\nBest regards,\n\nExam Management System`;

        senEmail(email, subject, body);

        return res.status(201).json(new ApiResponse(201, roleObjAssigned, "ROLE FOR USER CREATED...!"));


    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiError(
            500, "ROLE CANNOT BE CREATED...!", error
        ));
    }
}

export const getByRole = async (req, res) => {
    try {
        const { userType } = req.body;
        let userArr = [];
        if (userType === "INVIGILATOR") {
            userArr = await Invigilator.find();
        }
        else if (userType === "EXAM_OC") {
            userArr = await ExamOC.find();
        }
        else if (userType === "EXAMINER") {
            userArr = await Examiner.find();
        }
        else if (userType === "SUPPORT_STAFF") {
            userArr = await SupportStaff.find();
        }

        return res.status(200).json(new ApiResponse(201, userArr, "ROLE SPECIFIED FOR THE USERS...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "ROLE IS NOT ASSSIGNED TO ANY USER...!", error
        ));
    }
}

export const getByRoleAndExamNameAndDate = async (req, res) => {
    try {
        const { userType, examName, examDate } = req.body;
        console.log(userType, examName, examDate+'T00:00:00.000+00:00')
        let userArr = [];
        if (userType === "INVIGILATOR") {
            userArr = await Invigilator.find({userType, examName, examDate: examDate+'T00:00:00.000+00:00'});
        }
        else if (userType === "EXAM_OC") {
            userArr = await ExamOC.find({userType, examName, examDate});
        }
        else if (userType === "EXAMINER") {
            userArr = await Examiner.find({userType, examName, examDate});
        }
        else if (userType === "SUPPORT_STAFF") {
            userArr = await SupportStaff.find({userType, examName, examDate});
        }

        return res.status(200).json(new ApiResponse(201, userArr, "ROLE SPECIFIED FOR THE USERS...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "ROLE IS NOT ASSSIGNED TO ANY USER...!", error
        ));
    }
}

export const updateTheRoleForAUser = async (req, res) => {
    try {
        const { userType, email } = req.body;
        let roleAssignedObj;

        if (userType === "INVIGILATOR") {
            roleAssignedObj = await Invigilator.findOne({ email });
        }
        else if (userType === "EXAM_OC") {
            roleAssignedObj = await ExamOC.findOne({ email });
        }
        else if (userType === "EXAMINER") {
            roleAssignedObj = await Examiner.findOne({ email });
        }
        else if (userType === "SUPPORT_STAFF") {
            roleAssignedObj = await SupportStaff.findOne({ email });
        }

        if (!roleAssignedObj) {
            return res.status(404).json(new ApiResponse(404, userType, "NO USER IS ASSIGNED THE GIVEN ROLE...!"));
        }

        roleAssignedObj.userType = userType;
        await roleAssignedObj.save();

        return res.status(201).json(new ApiResponse(200, roleAssignedObj, "ROLE SPECIFIED FOR THE USERS...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "ROLE IS NOT ASSSIGNED TO ANY USER...!", error
        ));
    }
}

export const updateExaminerFromToTotalField = async (req, res) => {
    try {
        const updatedExaminer = req.body;
        console.log(updatedExaminer);
        if (updatedExaminer.userType !== "EXAMINER") {
            return res.status(400).json(new ApiResponse(404, updatedExaminer, "INVALID USER...!"));
        }
       
        const examiner = await Examiner.findByIdAndUpdate(
            updatedExaminer._id,
            {
                $set: {
                    from: updatedExaminer.from,
                    to: updatedExaminer.to,
                    total: updatedExaminer.total,
                },
            },
            { new: true } // Return the modified document
        );

        // examiner.from = updatedExaminer.from;
        // examiner.to = updatedExaminer.to;
        // examiner.total = updatedExaminer.total;

        // await examiner.save();

        const date = new Date(examiner.examDate);
        const formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

        const subject = `Appointment as Examiner for Exam: ${examiner.examName} on ${formattedDate}`;
        const body = `Dear ${examiner.username},\n\nWe trust this email finds you well. We are pleased to inform you that you have been appointed as an Examiner for the exam: ${examiner.examName}.\n\nDetails of the Exam:\n\nExam Name: ${examiner.examName}\nExam Date:   ${formattedDate}\n\nYour Assigned Role:\n\nExaminer\n1. You are responsible for evaluating the answer scripts assigned to you.\n2. The answer scripts will be from student UID ${examiner.from} to student UID ${examiner.to}.\n3. The total marks for each script should be recorded accurately.\n\nAssigned Range:\nStart UID: ${examiner.from}\nEnd UID:   ${examiner.to}\n\nYour contribution to the examination process is highly valued, and we appreciate your commitment to maintaining the integrity and accuracy of the evaluation process.\n\nThank you for your dedication, and we wish you a successful and smooth experience as an Examiner for ${examiner.examName}.\n\nBest regards,\n\nExam Management System`;

         senEmail(examiner.email, subject, body);
    console.log("saved:", examiner)
        return res.status(201).json(new ApiResponse(200, examiner, "EXAMINER UPDATED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAMINER NOT UPDATED...!", error
        ));
    }
}

export const deleteRoleForAUser = async (req, res) => {
    try {
        const { userType, _id } = req.body;
        let deletedObj;

        if (userType === "INVIGILATOR") {
            deletedObj = await Invigilator.findByIdAndDelete(_id);
        }
        else if (userType === "EXAM_OC") {
            deletedObj = await ExamOC.findByIdAndDelete(_id);
        }
        else if (userType === "EXAMINER") {
            deletedObj = await Examiner.findByIdAndDelete(_id);
        }
        else if (userType === "SUPPORT_STAFF") {
            deletedObj = await SupportStaff.findByIdAndDelete(_id);
        }

        if (!deletedObj) {
            return res.status(404).json(new ApiResponse(404, userType, "NO USER IS ASSIGNED THE GIVEN ROLE...!"));
        }

        return res.status(201).json(new ApiResponse(200, deletedObj, "ROLE SPECIFIED FOR THE USER DELETED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "ROLE IS NOT DELETED...!", error
        ));
    }
}

export const getUsersExamsId = async (req, res) => {
    try {
        const { userType, examId } = req.body;
        console.log("in user-examId", req.body)
        let usersArr = [];

            if (userType === "INVIGILATOR") {
                usersArr = await Invigilator.find({userType, examId });
            }
            else if (userType === "EXAM_OC") {
                usersArr = await ExamOC.find({userType, examId});
            }
            else if (userType === "EXAMINER") {
                usersArr = await Examiner.find({userType, examId});
            }
            else if (userType === "SUPPORT_STAFF") {
                usersArr = await SupportStaff.find({userType, examId});
            }

        return res.status(200).json(new ApiResponse(201, usersArr, "ROLE SPECIFIED FOR THE USERS BY EXAMID...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "ROLE IS NOT ASSSIGNED TO ANY USER...!", error
        ));
    }
}