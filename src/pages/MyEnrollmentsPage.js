import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import enrollmentService from "../services/enrollment.service";
import authService from "../services/auth.service"; 

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEnrollmentTable, setShowEnrollmentTable] = useState(false); 
  const [isStudentProfileMissing, setIsStudentProfileMissing] = useState(false); 
  const [studentId, setStudentId] = useState(""); // 🔹 new state

  const currentUser = authService.getCurrentUser(); 

  useEffect(() => {
    setMessage("");
    setIsStudentProfileMissing(false);
    setShowEnrollmentTable(false);

    if (!currentUser || !currentUser.roles.includes("ROLE_STUDENT")) {
      setMessage("You must be logged in as a student to view your enrollments.");
    }
  }, [currentUser]); 

  // 🔹 Fetch enrollments by studentId
  const handleFetchEnrollments = () => {
    if (!studentId.trim()) {
      setMessage("Please enter a Student ID.");
      return;
    }

    setMessage(""); 
    setIsStudentProfileMissing(false); 
    setIsLoading(true); 

    enrollmentService.getEnrollmentsByStudentId(studentId).then(
      (response) => {
        setEnrollments(response.data);
        setShowEnrollmentTable(true);
        setIsLoading(false);
        if (response.data.length === 0) {
          setMessage("No enrollments found for this Student ID.");
        }
      },
      (error) => {
        setIsLoading(false);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        if (resMessage.includes("No student profile found")) {
          setIsStudentProfileMissing(true);
        } else {
          setMessage("Error loading enrollments: " + resMessage);
        }
        setShowEnrollmentTable(false); 
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <h2>Course Enrollments</h2>
        <div className="alert alert-info">Loading enrollments...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Course Enrollments</h2>

      {/* 🔹 Input field for Student ID */}
      {currentUser && currentUser.roles.includes("ROLE_STUDENT") && (
        <div className="mb-3 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button
            onClick={handleFetchEnrollments}
            className="btn btn-secondary"
          >
            View Enrollments
          </button>
        </div>
      )}

      {/* Enroll in a course button */}
      {currentUser && currentUser.roles.includes("ROLE_STUDENT") && (
        <Link to="/enroll-course" className="btn btn-primary mb-3">
          Enroll in a Course
        </Link>
      )}

      {/* Error messages */}
      {isStudentProfileMissing && (
        <div className="alert alert-danger" role="alert">
          No student profile found for this user. Please contact admin.
        </div>
      )}
      {message && !isStudentProfileMissing && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {/* Enrollments table */}
      {showEnrollmentTable && enrollments.length > 0 && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Enrollment Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.id}</td>
                <td>
                  {enrollment.student.firstName} {enrollment.student.lastName} (
                  {enrollment.student.studentId})
                </td>
                <td>
                  {enrollment.course.title} ({enrollment.course.code})
                </td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;
