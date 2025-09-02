import api from "./config";

const getAllCourses = () => {
  return api.get("/courses");
};

const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};

const createCourse = (courseData) => {
  return api.post("/courses", courseData);
};

const updateCourse = (id, courseData) => {
  return api.put(`/courses/${id}`, courseData);
};

const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};

const courseApi = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseApi;