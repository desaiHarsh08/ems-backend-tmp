
import { ExamOC } from "../models/exam_oc.model.js";
import { Examiner } from "../models/examiner.model.js";
import { Invigilator } from "../models/invigilator.model.js";
import { SupportStaff } from "../models/support_staff.model.js";
import { User } from "../models/user.model.js";
import { sendWhatsAppMessage } from "../services/whatsapp_messaging.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const sendEmail = async (recipientEmail, subject, body) => {
    const response = await fetch(`${process.env.EMAIL_API_URL}/send-email-v2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientEmail, subject, body })
    });
    console.log(await response.json(), subject)
}

export const createRoleForUser = async (req, res) => {
    console.log('adding users: -');
    try {
        const { username, email, userType, phone, examName, examDate, examTime, examId, roomNumber, from, to, total, paperChecking } = req.body;
        const date = new Date(examDate);
        const formattedDate = `${date.getDate().toString().padStart(2, 0)}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getFullYear()}`;

        const subject = `Assignment as ${userType} for Exam: ${examName} on ${formattedDate}`;

        let roleObjAssigned;
        let body = '';
        let templateName = '';
        let messageArr = [];

        if (userType === "INVIGILATOR") {
            console.log("in invig")
            roleObjAssigned = await Invigilator.create({ username, email, userType, phone, examName, examDate, examTime, examId, roomNumber });
            body = `Dear ${username},\n\nYou have been assigned role of Invigilator for the following upcoming examination.\n\nName of the Exam: ${examName}\nExam Date: ${formattedDate}\nExam Time: ${examTime}\nRoom to invigilate: ${roomNumber}\n\nYou are requested to report to Exam OC in Room No.118, 30 Minutes before the schedule examination time.\n\nExamination Committee.`;
            templateName = "invi_role";
            messageArr = [username, examName, formattedDate, examTime, roomNumber];
        }
        else if (userType === "EXAM_OC") {
            roleObjAssigned = await ExamOC.create({ username, email, userType, phone, examName, examDate, examId, examTime });
            body = `Dear ${username},\n\nYou have been assigned role of Officer in Charge (OC)  for the following upcoming examination.\n\nName of the Exam: ${examName}\nExam Date: ${formattedDate}\nExam Time: ${examTime}\n\nAlong with the other Examination related work, you are requested to login to your EMS console and update the information as required therein.\n\nExamination Committee`;
            messageArr = [username, examName, formattedDate, examTime];
            templateName = "oc_role";
        }
        else if (userType === "EXAMINER") {
            roleObjAssigned = await Examiner.create({ username, email, userType, phone, examName, examDate, examId, examTime, from, to, total, paperChecking });
            

            body = `Dear ${username}\n\nYou have been assigned role of Examiner for the following upcoming examination. you will be allotted answer scripts for correction immediately after completion of examination. Once allotted, you will receive and email and WhatsApp also.\n\nOn allotment, you are require to collect the physical answer script from the Examination Control room, Room No 112 between 10AM to 4PM on any working day. The collection should be done within 24 hrs. from the receipt of allotment email/WhatsApp.\n\nYou are requested to check the allotted answer scripts with the specified time and upload the marks.\n\nYou can access your Examination Console by clinking the link given below.\n\nName of the Examination: ${examName}\nDate of Examination: ${formattedDate}\nExam Time: ${examTime}\nLast date for checking Answer Script: ${paperChecking.lastDateChecking}\nLast date for uploading of Marks: ${paperChecking.lastDateMarksUpload}\n\nExamination Committee
            `;

            templateName = "examiner_role";
            messageArr = [username, examName, examDate, examTime, paperChecking.lastDateChecking, paperChecking.lastDateMarksUpload]


        }
        else if (userType === "SUPPORT_STAFF") {
            console.log('support staff', { username, email, userType, phone, examName, examDate, examId, examTime })
            roleObjAssigned = await SupportStaff.create({ username, email, userType, phone, examName, examDate, examId, examTime });
            console.log(roleObjAssigned);
            body = `Dear ${username}\n\nYou have been assigned role of Support Staff for the following upcoming examination. you will need allott the answer scripts for correction immediately after completion of examination.\n\nName of the Examination: ${examName}\nDate of Examination: ${formattedDate}\nExam Time: ${examTime}\n\nExamination Committee
            `;
            console.log('sending email', email, subject, body )
            sendEmail(email, subject, body);
        }
        
        
        if(userType !== "SUPPORT_STAFF") {
            sendWhatsAppMessage(phone, messageArr, process.env.INTERAKT_API_KEY, process.env.INTERAKT_BASE_URL, templateName);
        }
        
        sendEmail(email, subject, body);

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
                    papperChecking: updatedExaminer.paperChecking
                },
            },
            { new: true } // Return the modified document
        );

        const date = new Date(examiner.examDate);
        const formattedDate = `${date.getDate().toString().padStart(2, 0)}-${date.getMonth().toString().padStart(2, 0)}-${date.getFullYear()}`;

        const subject = `Appointment as Examiner for Exam: ${examiner.examName} on ${formattedDate}`;

        const body = `Dear ${examiner.username}\n\nAs an examiner, you have been allotted answer script for correction and awarding marks for the following examination.\n\nYou are requested to collect the said answer script from room no. 115 on any working day between 10am to 4pm within 24 hrs. of receipt of allotment email/WhatsApp.\n\nName of the Examination: ${examiner.examName}\nDate of the Examination: ${formattedDate}\nLast date for paper checking: ${examiner.paperChecking.lastDateChecking}\nLast date for marks upload: ${examiner.paperChecking.lastDateMarksUpload}\n\nBest Regards\n\nExamination Committee`;
         sendEmail(examiner.email, subject, body);

         const messageArr = [examiner.username, examiner.examName, formattedDate, examiner.paperChecking.lastDateChecking, examiner.paperChecking.lastDateMarksUpload];

         sendWhatsAppMessage(
            examiner.phone, 
            messageArr, 
            process.env.INTERAKT_API_KEY, 
            process.env.INTERAKT_BASE_URL, 
            'as_allot'
        );
    
        return res.status(201).json(new ApiResponse(200, examiner, "EXAMINER UPDATED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAMINER NOT UPDATED...!", error
        ));
    }
}

export const updateExaminerWorkprogressDC = async (req, res) => {
    try {
        const { dateChecking, _id, examDate, examName } = req.body;
       
       
        const examiner = await Examiner.findById(_id);
        if(!examiner) {
            return res.status(404).json(new ApiResponse(404, examiner, "EXAMINER NOT FOUND...!"));

        }

        examiner.dateChecking = dateChecking;
        examiner.save();
    
        return res.status(201).json(new ApiResponse(200, examiner, "EXAMINER UPDATED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAMINER NOT UPDATED...!", error
        ));
    }
}

export const updateExaminerWorkprogressMU = async (req, res) => {
    try {
        const { dateMarksUpload, _id, examDate, examName } = req.body;
        
       
        const examiner = await Examiner.findById(_id);
        if(!examiner) {
            return res.status(404).json(new ApiResponse(404, examiner, "EXAMINER NOT FOUND...!"));

        }

        examiner.dateMarksUpload = dateMarksUpload;
        examiner.save();
    
        return res.status(201).json(new ApiResponse(200, examiner, "EXAMINER UPDATED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAMINER NOT UPDATED...!", error
        ));
    }
}

export const examinerWorkprogress = async (req, res) => {
    try {
        const { _id } = req.body;
        const examiner = await Examiner.findById(_id);

        if(!examiner) {
            return res.status(404).json(new ApiResponse(404, examiner, "EXAMINER NOT FOUND...!"));
        }

        if (examiner.userType !== "EXAMINER") {
            return res.status(400).json(new ApiResponse(404, updatedExaminer, "INVALID USER...!"));
        }
       

        let dateCheckingFlag = false;
        let marksUploadFlag = false;
        if(examiner.dateChecking!==''){
            dateCheckingFlag = true;
        }

        if(examiner.dateMarksUpload !== '') {
            marksUploadFlag = true;
        }
        
        return res.status(200).json(new ApiResponse(200, {dateCheckingFlag, marksUploadFlag}, "ALL DONE...!"));

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