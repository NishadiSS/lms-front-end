import api from "./config";

const getAllGrades = () => {
  return api.get("/grades");
};

const getGradeById = (id) => {
  return api.get(`/grades/${id}`);
};

const getGradesByStudent = (studentId) => {
  return api.get(`/grades/student/${studentId}`);
};

const getGradesByCourse = (courseId) => {
  return api.get(`/grades/course/${courseId}`);
};

const upsertGrade = (gradeData) => {

  if (gradeData.id) { 
    return api.put(`/grades/${gradeData.id}`, gradeData); 
  } else { 
    return api.post("/grades", gradeData);
  }
};

const deleteGrade = (id) => {
  return api.delete(`/grades/${id}`);
};

const gradeApi = {
  getAllGrades,
  getGradeById,
  getGradesByStudent,
  getGradesByCourse,
  upsertGrade,
  deleteGrade,
};

export default gradeApi;