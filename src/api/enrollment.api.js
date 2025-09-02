import api from "./config";

const getAllEnrollments = () => {
  return api.get("/enrollments");
};

const getEnrollmentById = (id) => {
  return api.get(`/enrollments/${id}`);
};

const getEnrollmentsByStudent = (studentId) => {
  return api.get(`/enrollments/student/${studentId}`);
};

const getEnrollmentsByCourse = (courseId) => {
  return api.get(`/enrollments/course/${courseId}`);
};

const enrollStudentInCourse = (enrollData) => {
  return api.post("/enrollments", enrollData);
};

const deleteEnrollment = (id) => {
  return api.delete(`/enrollments/${id}`);
};

const enrollmentApi = {
  getAllEnrollments,
  getEnrollmentById,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  enrollStudentInCourse,
  deleteEnrollment,
};

export default enrollmentApi;