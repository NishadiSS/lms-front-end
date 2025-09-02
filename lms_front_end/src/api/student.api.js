import api from "./config";

const getAllStudents = () => {
  return api.get("/students");
};

const getStudentById = (id) => {
  return api.get(`/students/${id}`);
};

const createStudent = (studentData) => {
  return api.post("/students", studentData);
};

const updateStudent = (id, studentData) => {
  return api.put(`/students/${id}`, studentData);
};

const deleteStudent = (id) => {
  return api.delete(`/students/${id}`);
};

const studentApi = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

export default studentApi;