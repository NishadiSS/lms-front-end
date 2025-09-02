import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gradeApi from "../../api/grade.api";
import enrollmentApi from "../../api/enrollment.api";
import authApi from "../../api/auth.api";

const GradeForm = () => {
  const { id, enrollmentId: initialEnrollmentId } = useParams(); // For edit mode or pre-filling enrollment ID
  const navigate = useNavigate();
  const [gradeData, setGradeData] = useState({
    enrollmentId: initialEnrollmentId || "",
    gradeValue: "",
    score: "",
    remarks: "",
  });
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // Fetch all enrollments for dropdown
    enrollmentApi.getAllEnrollments().then(
      (response) => {
        setEnrollments(response.data);
      },
      (error) => {
        console.error("Error fetching enrollments:", error);
      }
    );

    if (id) {
      setIsEditMode(true);
      gradeApi.getGradeById(id).then(
        (response) => {
          setGradeData({
            enrollmentId: response.data.enrollment.id,
            gradeValue: response.data.gradeValue,
            score: response.data.score,
            remarks: response.data.remarks,
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
        }
      );
    }
  }, [id, initialEnrollmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGradeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const dataToSubmit = { ...gradeData, score: parseFloat(gradeData.score) };

    const action = isEditMode
      ? gradeApi.upsertGrade({ ...dataToSubmit, id: id }) // Pass ID for update operation
      : gradeApi.upsertGrade(dataToSubmit);

    action.then(
      () => {
        navigate("/grades");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      }
    );
  };

  const isAdminOrInstructor = currentUser && (currentUser.roles.includes("ROLE_ADMIN") || currentUser.roles.includes("ROLE_INSTRUCTOR"));

  if (!isAdminOrInstructor) {
      return <div className="container mt-5 alert alert-danger">You are not authorized to assign/edit grades.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>{isEditMode ? "Edit Grade" : "Assign New Grade"}</h2>
      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="enrollmentId">Enrollment</label>
          <select
            className="form-control"
            id="enrollmentId"
            name="enrollmentId"
            value={gradeData.enrollmentId}
            onChange={handleChange}
            required
            disabled={isEditMode} // Enrollment cannot be changed for existing grade
          >
            <option value="">Select an Enrollment</option>
            {enrollments.map((enrollment) => (
              <option key={enrollment.id} value={enrollment.id}>
                Student: {enrollment.student.firstName} {enrollment.student.lastName} (Course: {enrollment.course.title})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="gradeValue">Grade Value (e.g., A, B+, C)</label>
          <input
            type="text"
            className="form-control"
            id="gradeValue"
            name="gradeValue"
            value={gradeData.gradeValue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="score">Score (0.0 - 100.0)</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            id="score"
            name="score"
            value={gradeData.score}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="remarks">Remarks (Optional)</label>
          <textarea
            className="form-control"
            id="remarks"
            name="remarks"
            value={gradeData.remarks}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Grade" : "Assign Grade"}
        </button>
        <button type="button" onClick={() => navigate("/grades")} className="btn btn-secondary ms-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default GradeForm;