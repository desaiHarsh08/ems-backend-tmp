import { Exam } from "../models/exam.model.js";
import { ExamReadOnly } from "../models/exam_read_only.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// MAKE THE GIVEN EXAM'S ATTENDANCE AS AS READ_ONLY
export const createExamReadOnly = async (req, res) => {
    try {
        
        const { examName, examDate, floorNumber, roomNumber } = req.body;
        console.log(req.body)
        const uniqueId = `${examName}/${examDate}/${floorNumber}/${roomNumber}`;
        const isExamReadOnlyExist = await ExamReadOnly.findOne({uniqueId});
        if(isExamReadOnlyExist) {
            return res?.status(400).json(new ApiResponse(400, null, "EXAM ALREADY MARKED AS READ_ONLY...!"));
        }

        const examReadOny = new ExamReadOnly();

        examReadOny.examName = examName;
        examReadOny.examDate = examDate;
        examReadOny.uniqueId = `${examName}/${examDate}/${floorNumber}/${roomNumber}`;

        const savedExamReadOnly = await examReadOny.save();

        return res.status(201).json(new ApiResponse(201, savedExamReadOnly, "EXAM MARKED AS READ_ONLY...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE MARKED AS READ_ONLY...!", error
        ));
    }
}

// GET THE EXAM WHICH IS SET TO READ_ONLY FOR ATTENDANCE ON THE BASIS OF EXAM_NAME, EXAM_DATE, FLOOR, & ROOM
export const getExamReadOnly = async (req, res) => {
    try {
        
        const { examName, examDate, floorNumber, roomNumber } = req.body;

        const uniqueId = `${examName}/${examDate}/${floorNumber}/${roomNumber}`;
        const examReadOnly = await ExamReadOnly.findOne({uniqueId});
        if(!examReadOnly) {
            return res.status(404).json(new ApiResponse(404, null, "EXAM IS NOT SET AS READ_ONLY...!"));
        }

        return res.status(201).json(new ApiResponse(201, examReadOnly, "EXAM IS SET AS READ_ONLY...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM FOR READ_ONLY CANNOT BE FETCHED...!", error
        ));
    }
}

// GET THE READ_ONLY EXAM BASED ON FLOORS
export const getExamsReadOnlyByFloors = async (req, res) => {
    try {
        
        const { examName, examDate, floorNumber } = req.body;

        const uniqueId = `${examName}/${examDate}/${floorNumber}`;
        const examArr = await ExamReadOnly.find({examName, examDate});
        const arr = [];
        for(let i = 0; i < examArr.length; i++) {
            if(examArr[i].uniqueId.startsWith(uniqueId)) {
                arr.push(examArr[i]);
            }
        }
        // const exam = await Exam.findOne({examName, examDate});
        // exam.examLocations.filter(ele => ele.floorNumber==floorNumber && ele.rooms.length===)

        return res.status(201).json(new ApiResponse(201, arr, "EXAM ON THE FLOORS SET TO READ_ONLY ARE FETCHED...!"));

    } catch (error) {
        console.error(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM FOR READ_ONLY CANNOT BE FETCHED...!", error
        ));
    }
}

// GET THE READ_ONLY EXAM BASED ON ROOMS
export const getExamsReadOnlyByRooms = async (req, res) => {
    try {
        
        const { examName, examDate, floorNumber, roomNumber } = req.body;

        const uniqueId = `${examName}/${examDate}/${floorNumber}/${roomNumber}`;
        const examArr = await ExamReadOnly.find({examName, examDate});
        const arr = [];
        for(let i = 0; i < examArr.length; i++) {
            if(examArr[i].uniqueId.startsWith(uniqueId)) {
                arr.push(examArr[i]);
            }
        }

        return res.status(201).json(new ApiResponse(201, arr, "EXAM ON THE ROOMS SET TO READ_ONLY ARE FETCHED...!"));

    } catch (error) {
        console.error(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM FOR READ_ONLY BY ROOMS CANNOT BE FETCHED...!", error
        ));
    }
}