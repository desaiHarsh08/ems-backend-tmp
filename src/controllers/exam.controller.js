import { validationResult } from "express-validator";
import { Exam } from "../models/exam.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// HELPER FUNCTION FOR THE SPECIFIC TASK

const convertTimeToAMPM = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    let formattedHours = parseInt(hours, 10);
    const period = formattedHours >= 12 ? 'PM' : 'AM';

    if (formattedHours > 12) {
        formattedHours -= 12;
    } else if (formattedHours === 0) {
        formattedHours = 12;
    }

    return `${formattedHours}:${minutes} ${period}`;
}

const formatDate = (date) => {
    // return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
    let tmp = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').join('-');
    let y = tmp.substring(6);
    let d = tmp.substring(3, 5);
    let m = tmp.substring(0, 2);

    let dateStr = `${y}-${m}-${d}`;
    console.log(dateStr);

    return dateStr;

}

const clearDate = (arr) => {
    const currentDate = new Date(); // Current date and time
    currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    // Filter exams with dates greater than or equal to the current date
    return arr.filter(item => new Date(item.examDate + 'T00:00:00.000Z') >= currentDate);
}

// ______________________________________________________________________________________________________

// CREATE AN EXAM
export const createExam = async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "BAD REQUEST!", errors));
    }

    const { examName, examDate, examTime, examLocations } = req.body;

    try {
        const exam = new Exam({ examName, examDate, examTime, examLocations })
        // Return for duplicate exam
        if (await Exam.findOne({ examDate, examName })) {
            return res.status(409).json(new ApiResponse(409, exam, "EXAM ALREADY CREATED...!"));
        }

        const savedExam = await exam.save();

        return res.status(201).json(new ApiResponse(201, savedExam, "EXAM CREATED...!"));

    } catch (error) {
        console.error("Exam could not be created!\n", error);
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE CREATED...!", error
        ));
    }
}

export const getAllExam = async(req, res) => {
    try {
        const currentDate = new Date();
        const exams = await Exam.find({examDate: { $lt: currentDate }});
        return res.status(200).json(new ApiResponse(200, exams, "EXAMS RETRIEVED...!"));
    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE FETCHED...!", error
        ));
    }
}

// GET AN EXAM BY ID
export const getExam = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json(new ApiResponse(404, null, "EXAM DOESN'T EXIST...!"));
        }

        return res.status(200).json(new ApiResponse(200, exam, "EXAM RETRIEVED...!"));

    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE FETCHED...!", error
        ));
    }
}

// DELETE AN EXAM BY ID
export const deleteExam = async (req, res) => {
    try {
        const id = req.params.id;
        const exam = await Exam.findByIdAndDelete({ _id: id });
        if (!exam) {
            return res.status(404).json(new ApiResponse(404, null, "EXAM DOESN'T EXIST...!"));
        }

        return res.status(200).json(new ApiResponse(200, exam, "EXAM DELETED...!"));

    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE DELETED...!", error
        ));
    }
}

// GET AN EXAM BY EXAM NAME AND DATE
export const getExamByNameAndDate = async (req, res) => {
    try {
        const { examName, examDate } = req.body;
        console.log(examName, examDate)
        const exam = await Exam.findOne({ examName, examDate });
        if (!exam) {
            return res.status(404).json(new ApiResponse(404, null, "EXAM DOESN'T EXIST...!"));
        }

        return res.status(200).json(new ApiResponse(200, exam, "EXAM FOUND...!"));

    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE FETCHED...!", error
        ));
    }
}

// GET THE CURRENT EXAM(S) AND UPCOMING EXAM(S)
export const recentAndUpcomingExam = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();
        const searchDate = `${currentDate.getFullYear()}-${currentDate.getMonth().toString().padStart(2, 0)}-${currentDate.getDay()}T00:00:00.000+00:00`
        console.log("searchDate:", searchDate);

        // Find upcoming exams
        const upcomingExams = await Exam.find({
            examDate: { $gt: currentDate }
        }).sort({ examDate: 1 }); // Adjust the limit as needed

        // Find recent exams (for today and past)
        const recentExams = await Exam.find({
            examDate: { $lte: currentDate }
        }).sort({ examDate: -1 }); // Adjust the limit as needed

        // Convert examTime to AM/PM format
        const formattedUpcomingExams = upcomingExams.map(exam => ({
            ...exam.toObject(),
            examDate: formatDate(exam.examDate),

            examTime: convertTimeToAMPM(exam.examTime)
        }));

        console.log("line 171, recentExams = ", recentExams);

        const formattedRecentExams = recentExams.map(exam => ({
            ...exam.toObject(),
            examDate: formatDate(exam.examDate),
            // examTime: convertTimeToAMPM(exam.examTime)
            examTime: exam.examTime
        }));

        const examsObj = {
            upcomingExams: clearDate(formattedUpcomingExams),
            recentExams: clearDate(formattedRecentExams)
        };

        return res.status(200).json(new ApiResponse(200, examsObj, "RECENT AND UPCOMING EXAMS...!"));

    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE FETCHED...!", error
        ));
    }
}

// // UPDATE THE EXAM
// export const updateExam = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const updatedExamObj = req.body;
//         // console.log(updatedExamObj.examLocations[0].rooms);

//         let exam = await Exam.findById(updatedExamObj._id);
//         if (!exam) {
//             return res.status(404).json(new ApiResponse(404, null, "EXAM DOESN'T EXIST...!"));
//         }

//         for(let i = 0; i < exam.examLocations.length; i++) {
//             for(let j = 0; j < exam.examLocations[i].length; j++) { // For floor
//                 for(let k = 0; k < exam.examLocations[i][j].length; k++) { // For room
//                     exam.examLocations[i][j][k].answerScript = updateExam.examLocations[i][j][k].answerScript
//                 }
//             }
//         }


//         return res.status(200).json(new ApiResponse(200, exam, "EXAM UPDATED...!"));

//     } catch (error) {
//         console.error(error);
//         return res.status(error.code || 500).json(new ApiError(
//             error.code, "EXAM CANNOT BE DELETED...!", error
//         ));
//     }
// }

// UPDATE THE EXAM
export const updateExam = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedExamObj = req.body;

        let exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json(new ApiResponse(404, null, "EXAM DOESN'T EXIST...!"));
        }

        // exam.examLocations = [];
        // console.log(exam.examLocations)
        // for (let i = 0; i < updatedExamObj.examLocations.length; i++) {
        //    exam.examLocations.push(updatedExamObj.examLocations[i]);
        // }


        exam.examLocations = updatedExamObj.examLocations;

        
           
        



        // Save the updated exam
        const updatedExam = await exam.save();

        return res.status(200).json(new ApiResponse(200, updatedExam, "EXAM UPDATED...!"));

    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json(new ApiError(
            error.code, "EXAM CANNOT BE UPDATED...!", error
        ));
    }
}
