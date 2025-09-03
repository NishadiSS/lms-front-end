import api from "./api"; 

// Get logged-in student's enrollments
const getMyEnrolledCourses = () => {
  return api.get("/enrollments/my-courses");
};

// 🔥 New: Get enrollments by studentId (admin/instructor/student id ekak enter karala ganna)
const getEnrollmentsByStudentId = (studentId) => {
  return api.get(`/enrollments/student/${studentId}`);
};

const enrollmentService = {
  getMyEnrolledCourses,
  getEnrollmentsByStudentId,   // include it here
  // getAllEnrollments,
  // createEnrollment,
};

export default enrollmentService;
