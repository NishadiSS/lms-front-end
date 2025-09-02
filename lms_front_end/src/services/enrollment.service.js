// lms_front_end/src/services/enrollment.service.js

import api from "./api"; // ඔබගේ api.js ගොනුවට නිවැරදි path එක යොදන්න.
                       // සාමාන්‍යයෙන්, src/services/api.js ලෙස තිබිය යුතුය.

const getMyEnrolledCourses = () => {
  return api.get("/enrollments/my-courses");
};

// ඔබට admin/instructor ලෙස enrollments fetch කිරීමට අවශ්‍ය නම්, මෙහි add කළ හැක.
// උදාහරණයක් ලෙස:
/*
const getAllEnrollments = () => {
  return api.get("/enrollments");
};

const createEnrollment = (studentId, courseId) => {
  return api.post("/enrollments", { studentId, courseId });
};
*/

const enrollmentService = {
  getMyEnrolledCourses,
  // getAllEnrollments, // අවශ්‍ය නම් uncomment කරන්න
  // createEnrollment,  // අවශ්‍ය නම් uncomment කරන්න
};

export default enrollmentService;