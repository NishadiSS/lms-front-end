import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentApi from "../../api/student.api";
import authApi from "../../api/auth.api";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    studentApi.getStudentById(id).then(
      (response) => {
        setStudent(response.data);
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
    if (window.confirm("Are you sure you want to delete this student?")) {
      studentApi.deleteStudent(id).then(
        () => {
          navigate("/students");
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

  const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");
  const isOwner = currentUser && student && currentUser.id === student.userId; // Check if current user is the owner of the student profile

  if (!student) {
    return (
      <div className="container mt-5">
        {message ? (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        ) : (
          <p>Loading student details...</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Student Details</h2>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
      <div className="card">
        <div className="card-header">Student: {student.firstName} {student.lastName}</div>
        <div className="card-body">
          <p>
            <strong>ID:</strong> {student.id}
          </p>
          <p>
            <strong>Student ID:</strong> {student.studentId}
          </p>
          <p>
            <strong>Name:</strong> {student.firstName} {student.lastName}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          {(isAdmin || isOwner) && ( // Admin or owner can edit/delete
            <div className="mt-3">
              <button onClick={() => navigate(`/students/edit/${student.id}`)} className="btn btn-warning me-2">
                Edit Profile
              </button>
              {isAdmin && ( // Only Admin can delete
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete Student
                </button>
              )}
            </div>
          )}
          <button onClick={() => navigate("/students")} className="btn btn-secondary mt-3">
            Back to Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;