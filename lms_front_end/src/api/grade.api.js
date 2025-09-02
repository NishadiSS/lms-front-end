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
  // upsertGrade (create/update) method එක Backend එකේ POST ලෙස සාදා ඇති නිසා
  // මෙහිදී එය POST ලෙසම භාවිතා කරයි.
  // යම් grade එකක් update කරනවා නම්, Backend එකේ PUT mapping එකක් තිබිය යුතුය.
  // මෙහිදී සරලව POST එකක් ලෙස implement කර ඇත.
  // ඔබට update සඳහා වෙනම API call එකක් (PUT) අවශ්‍ය නම්, Backend එකේත් එය සාදා, මෙහිත් updateGrade වැනි method එකක් එක් කරන්න.
  if (gradeData.id) { // If ID exists, it's an update (Backend upsert logic should handle this)
    return api.put(`/grades/${gradeData.id}`, gradeData); // Assuming PUT /api/grades/{id} for update
  } else { // No ID, so create new
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