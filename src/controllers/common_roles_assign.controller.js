
import { ExamOC } from "../models/exam_oc.model.js";
import { Examiner } from "../models/examiner.model.js";
import { Invigilator } from "../models/invigilator.model.js";
import { SupportStaff } from "../models/support_staff.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const createRoleForUser = async (req, res) => {
    try {
        const { username, email, userType, phone, examName, examDate, examTime, examId, roomNumber } = req.body;
  

        let roleObjAssigned;
        if (userType === "INVIGILATOR") {
            console.log("in invig")
            roleObjAssigned = await Invigilator.create({ username, email, userType, phone, examName, examDate, examTime, examId, roomNumber });
        }
        else if (userType === "EXAM_OC") {
            roleObjAssigned = await ExamOC.create({ username, email, userType, phone, examName, examDate, examId, examTime });
        }
        else if (userType === "EXAMINER") {
            roleObjAssigned = await Examiner.create({ username, email, userType, phone, examName, examDate, examId, examTime });
        }
        else if (userType === "SUPPORT_STAFF") {
            roleObjAssigned = await SupportStaff.create({ username, email, userType, phone, examName, examDate, examId, examTime });
        }

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
        let userArr = [];
        if (userType === "INVIGILATOR") {
            userArr = await Invigilator.find({userType, examName, examDate});
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