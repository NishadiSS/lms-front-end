import React, { useState, useEffect } from "react";
import enrollmentApi from "../../api/enrollment.api";
import authApi from "../../api/auth.api";
import studentApi from "../../api/student.api";
import { Link } from "react-router-dom";

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);

      if (user.roles.includes("ROLE_STUDENT")) {
        studentApi.getAllStudents()
          .then(res => {
            const student = res.data.find(s => s.userId === user.id);
            if (student) {
              setCurrentStudentId(student.id);
              enrollmentApi.getEnrollmentsByStudent(student.id)
                .then((response) => {
                  setEnrollments(response.data);
                })
                .catch((error) => {
                  const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                  setMessage(resMessage);
                  console.error("Error fetching student enrollments:", error);
                });
            } else {
              setMessage("No student profile found for your user account. Please contact admin.");
            }
          })
          .catch(err => {
            console.error("Error fetching student profile:", err);
            setMessage("Could not retrieve student profile.");
          });
      } else {
        enrollmentApi.getAllEnrollments()
          .then((response) => {
            setEnrollments(response.data);
          })
          .catch((error) => {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            setMessage(resMessage);
            console.error("Error fetching all enrollments:", error);
          });
      }
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      enrollmentApi.deleteEnrollment(id)
        .then(() => {
          setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id));
          setMessage("Enrollment deleted successfully!");
        })
        .catch((error) => {
          const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
          setMessage(resMessage);
        });
    }
  };

  const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");
  const isStudent = currentUser && currentUser.roles.includes("ROLE_STUDENT");
  const isInstructor = currentUser && currentUser.roles.includes("ROLE_INSTRUCTOR");

  return (
    <div className="container mt-5">
      <h2>Course Enrollments</h2>
      {(isAdmin || isStudent || isInstructor) && (
        <Link to="/enrollments/new" className="btn btn-primary mb-3">
          Enroll in a Course
        </Link>
      )}

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {enrollments.length === 0 && !message ? (
        <p>No enrollments found.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Enrollment Date</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.id}</td>
                <td><Link to={`/students/${enrollment.student.id}`}>{enrollment.student.firstName} {enrollment.student.lastName}</Link> ({enrollment.student.studentId})</td>
                <td><Link to={`/courses/${enrollment.course.id}`}>{enrollment.course.title}</Link> ({enrollment.course.code})</td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => handleDelete(enrollment.id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EnrollmentList;