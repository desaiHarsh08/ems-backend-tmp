
import { Exam } from "../models/exam.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import ApiError from "../utils/ApiError.js";

// HELPER FUNCTIONS FOR PERFORMING SPECIFIC TASK: -

const formatDate = (date) => {
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

//_____________________________________________________________________________________________

// ADD A STUDENT
export const createStudent = async (req, res) => {
    const { studentName, studentUID, examDetails, isPresent } = req.body;
    console.log(studentName, studentUID, examDetails, isPresent)
    try {
        const student = await Student.create({
            studentName,
            studentUID,
            examDetails,
            isPresent
        });
        return res.status(201).json(new ApiResponse(201, student, "STUDENT ADDED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "STUDENT CANNOT BE ADDED...!", error
        ));
    }
}

// DELETE A STUDENT
export const deleteStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findByIdAndDelete({ _id: id });
        if (!student) {
            return res.status(404).json(new ApiResponse(404, student, "STUDENT NOT FOUND...!"));
        }

        return res.status(200).json(new ApiResponse(200, student, "STUDENT DELETED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "STUDENT CANNOT BE DELETED...!", error
        ));
    }
}

// GET STUDENTS ON THE BASIS OF ROOM
export const getStudents = async (req, res) => {
    const { examName, examDate, floorNumber, roomNumber } = req.body;
    console.log(examName, examDate, floorNumber, roomNumber)
    try {
        const students = await Student.find({
            'examDetails.examName': examName,
            'examDetails.examDate': examDate,
            'examDetails.floorNumber': floorNumber,
            'examDetails.roomNumber': roomNumber
        });
        if (students.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "NO STUDENT FOUND...!"));
        }

        return res.status(200).json(new ApiResponse(200, students, "STUDENTS FETCHED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "STUDENT CANNOT BE FETCHED...!", error
        ));
    }
}

// UPDATE A STUDENT
export const updateStudent = async (req, res) => {
    const studentGiven = req.body.student;
    console.log("studentGiven: ", studentGiven);
    try {
        const filter = { _id: studentGiven._id }; // Assuming you have the _id property
        const update = { ...studentGiven }; // Assuming you want to update all properties

        let student = await Student.findOneAndUpdate(filter, update, { new: true }); // { new: true } returns the modified document
        if (!student) {
            return res.status(404).json(new ApiResponse(404, null, "STUDENT NOT FOUND...!"));
        }

        console.log("updated student:", student);

        return res.status(200).json(new ApiResponse(200, student, "STUDENT UPDATED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "STUDENT CANNOT BE UPDATED...!", error
        ));
    }
}

// GET STUDENTS ON THE BASIS OF EXAM_NAME AND EXAM_DATE
export const getStudentsByNameAndDate = async (req, res) => {
    const { searchObj } = req.body;
    console.log("\n\n\n\n", searchObj, "\n\n\n");
    if(!searchObj.examDate.includes('T00:00:00.000Z')) {
        searchObj.examDate =searchObj.examDate + 'T00:00:00.000Z';
    }
    try {
        const students = await Student.find({
            'examDetails.examName': `${searchObj.examName}`,
            'examDetails.examDate': `${searchObj.examDate}`,
        });
        return res.status(200).json(new ApiResponse(200, students, "Students found!"));

    } catch (error) {
        console.log(error);
    }
}

// GET STUDENTS ON THE BASIS OF EXAM_NAME, EXAM_DATE, FROM, TO AND TOTAL
export const getStudentsByAllotmentRegister = async (req, res) => {
    let { examName, examDate, fromRollNo, toRollNo, total } = req.body;
    fromRollNo = fromRollNo.startsWith('0') ? fromRollNo.substring(1) : fromRollNo;
    toRollNo = toRollNo.startsWith('0') ? toRollNo.substring(1) : toRollNo;

    console.log(examName, new Date(examDate), fromRollNo, toRollNo, total);
    if(!examDate.includes('T00:00:00.000Z')) {
        examDate = examDate + 'T00:00:00.000Z';
    }
    try {
        const students = await Student.find({
            'examDetails.examName': `${examName}`,
            'examDetails.examDate': `${new Date(examDate)}`,
        });
console.log("students.length =", students.length);
        // for(let i = 0; i < students.length; i++) {
        //     students[i] = students[i].toString().padStart(10, 0);
        // }

    
console.log("fromRollNo:", fromRollNo);
console.log("toRollNo:", toRollNo);
console.log("student[0] = ",students[0].studentUID );
        const arr = [];
        // let i = students.find((ele) => ele.studentUID == fromRollNo).studentUID;
        // let end = students.find((ele) => ele.studentUID == toRollNo);
// console.log(i, end);
        for(let i = 0; i < students.length; i++) {
            if(students[i].studentUID == fromRollNo && students[i].isPresent) {
                arr.push(students[i]);
            }

            if(students[i].studentUID == toRollNo) {
                break;
            }


        }

        return res.status(200).json(new ApiResponse(200, arr, "Allotment register list!"));

    } catch (error) {
        console.log(error);
    }
}

// GET THE STUDENTS ON THE BASIS OF CURRENT DATE (TODAY)
const getRecentExams = async () => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Find recent exams (for today and past)
        let recentExams = await Exam.find({
            examDate: { $lte: currentDate }
        }).sort({ examDate: -1 }).limit(5); // Adjust the limit as needed
        const formattedRecentExams = recentExams.map(exam => ({
            ...exam.toObject(),
            // examDate: new Date(exam.examDate).toLocaleDateString('en-US', formatOptions),
            examDate: formatDate(exam.examDate),
            examTime: convertTimeToAMPM(exam.examTime)
        }));

        return recentExams = clearDate(formattedRecentExams);
    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "RECENT EXAM STUDENTS CANNOT BE FETCHED...!", error
        ));
    }
}

// GET THE STUDENTS ATTENDANCE BY THE TODAY'S DATE
export const getStudentsStats = async (req, res) => {
    try {
        const recentExams = await getRecentExams();
        const currentDate = new Date();
        console.log(recentExams);
        const allStudents = await Student.find({ 'examDetails.examDate': { $lte: currentDate } })
        console.log(allStudents.length)
        const arr = [];
        for (let i = 0; i < recentExams.length; i++) {
            const studentsByExamName = allStudents.filter((ele) => (
                ele.examDetails.examName === recentExams[i].examName &&
                formatDate(ele.examDetails.examDate) === recentExams[i].examDate
            ));

            // console.log(studentsByExamName, studentsByExamName.length)

            // Find all room numbers
            let roomNumbersArr = new Set();
            for (let j = 0; j < studentsByExamName.length; j++) {
                if (roomNumbersArr.has(studentsByExamName[j].examDetails.roomNumber)) { continue; }
                roomNumbersArr.add(studentsByExamName[j].examDetails.roomNumber);
            }
            console.log(roomNumbersArr, roomNumbersArr.size)


            // Find the total students in the particular room
            roomNumbersArr.forEach((roomNumber) => {
                console.log(roomNumber);

                let studentsArr = studentsByExamName.filter((ele) => ele.examDetails.roomNumber === roomNumber);
                console.log("studentsArr: ", studentsArr);

                let tmp = studentsArr.filter((ele) => ele.isPresent === true);
                let present = tmp.length;
                let absent = studentsArr.length - present;

                let obj = {
                    examName: recentExams[i].examName,
                    examDate: recentExams[i].examDate,
                    roomNumber: roomNumber,
                    totalStudents: studentsArr.length,
                    present: present,
                    absent: absent
                };

                arr.push(obj);
            });
        }
        return res.status(200).json(new ApiResponse(200, arr, "Students stats!"));
    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "STUDENT STATS CANNOT BE FETCHED...!", error
        ));
    }
}
 
// GET THE STUDENTS ATTENDANCE BY EXAM_NAME AND EXAM_DATE
export const getStudentsStatsByNameAndDate = async (req, res) => {
    const { examName, examDate } = req.body;
    try {
        const students = await Student.find({
            'examDetails.examName': examName,
            'examDetails.examDate': examDate
        });
        if (students.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "STUDENTS NOT FOUND!"));
        }

        const exam = await Exam.findOne({ examName, examDate });

        if (exam.examDate == students[0].examDetails.examDate) {
            console.log("ok");
        }
        // console.log(exam.examDate, students[0].examDetails.examDate);
        console.log(students[0])

        const allStats = [];
        for (let i = 0; i < exam.examLocations.length; i++) {
            // For floor exam.examLocations[i]
            let floorNumber = exam.examLocations[i].floorNumber;
            let rooms = exam.examLocations[i].rooms;

            // For every room
            for (let j = 0; j < rooms.length; j++) {
                let obj = {};

                let arr = students.filter(ele => (
                    rooms[j].roomNumber !== undefined && ele.examDetails.roomNumber == rooms[j].roomNumber &&
                    ele.examDetails.floorNumber == floorNumber
                ));
                
                console.log(arr[0]);
                let present = (arr.filter((ele) => ele.isPresent === true)).length;
                let absent = arr.length - present;

                obj.examName = exam.examName;
                obj.examDate = exam.examDate;
                obj.roomNumber = rooms[j].roomNumber
                obj.totalStudents = arr.length;
                obj.present = present;
                obj.absent = absent;
                console.log(obj)

                allStats.push(obj);
            }
        }


        return res.status(200).json(new ApiResponse(200, allStats, "STUDENTS STATS RETRIEVED...!"));

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "STUDENT STATS BY EXAM_NAME AND EXAM_DATE CANNOT BE FETCHED...!", error
        ));
    }

}