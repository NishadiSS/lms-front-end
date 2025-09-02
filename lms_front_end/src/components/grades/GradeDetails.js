import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gradeApi from "../../api/grade.api";
import authApi from "../../api/auth.api";
import { Link } from "react-router-dom";

const GradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grade, setGrade] = useState(null);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    gradeApi.getGradeById(id).then(
      (response) => {
        setGrade(response.data);
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
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      gradeApi.deleteGrade(id).then(
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
    }
  };

  const isAdminOrInstructor = currentUser && (currentUser.roles.includes("ROLE_ADMIN") || currentUser.roles.includes("ROLE_INSTRUCTOR"));
  // const isOwner = currentUser && grade && currentUser.id === grade.enrollment.student.userId; // Backend securityUtils handles this

  if (!grade) {
    return (
      <div className="container mt-5">
        {message ? (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        ) : (
          <p>Loading grade details...</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Grade Details</h2>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
      <div className="card">
        <div className="card-header">Grade for {grade.enrollment.student.firstName} {grade.enrollment.student.lastName} in {grade.enrollment.course.title}</div>
        <div className="card-body">
          <p>
            <strong>Enrollment ID:</strong> {grade.enrollment.id}
          </p>
          <p>
            <strong>Student:</strong>{" "}
            <Link to={`/students/${grade.enrollment.student.id}`}>
              {grade.enrollment.student.firstName} {grade.enrollment.student.lastName} ({grade.enrollment.student.userId})
            </Link>
          </p>
          <p>
            <strong>Course:</strong>{" "}
            <Link to={`/courses/${grade.enrollment.course.id}`}>
              {grade.enrollment.course.title} ({grade.enrollment.course.code})
            </Link>
          </p>
          <p>
            <strong>Grade Value:</strong> {grade.gradeValue}
          </p>
          <p>
            <strong>Score:</strong> {grade.score}
          </p>
          <p>
            <strong>Remarks:</strong> {grade.remarks || "N/A"}
          </p>
          {isAdminOrInstructor && (
            <div className="mt-3">
              <button onClick={() => navigate(`/grades/edit/${grade.id}`)} className="btn btn-warning me-2">
                Edit Grade
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Grade
              </button>
            </div>
          )}
          <button onClick={() => navigate("/grades")} className="btn btn-secondary mt-3">
            Back to Grades
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeDetails;