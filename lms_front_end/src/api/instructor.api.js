import api from "./config";

const getAllInstructors = () => {
  return api.get("/instructors");
};

const getInstructorById = (id) => {
  return api.get(`/instructors/${id}`);
};

const createInstructor = (instructorData) => {
  return api.post("/instructors", instructorData);
};

const updateInstructor = (id, instructorData) => {
  return api.put(`/instructors/${id}`, instructorData);
};

const deleteInstructor = (id) => {
  return api.delete(`/instructors/${id}`);
};

const instructorApi = {
  getAllInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};

export default instructorApi;