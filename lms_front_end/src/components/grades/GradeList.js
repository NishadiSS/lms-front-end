import React, { useState, useEffect } from "react";
import gradeApi from "../../api/grade.api";
import authApi from "../../api/auth.api";
import studentApi from "../../api/student.api";
import { Link } from "react-router-dom";

const GradeList = () => {
  const [grades, setGrades] = useState([]);
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
              gradeApi.getGradesByStudent(student.id)
                .then((response) => {
                  setGrades(response.data);
                })
                .catch((error) => {
                  const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                  setMessage(resMessage);
                  console.error("Error fetching student grades:", error);
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
        gradeApi.getAllGrades()
          .then((response) => {
            setGrades(response.data);
          })
          .catch((error) => {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            setMessage(resMessage);
            console.error("Error fetching all grades:", error);
          });
      }
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      gradeApi.deleteGrade(id)
        .then(() => {
          setGrades(grades.filter((grade) => grade.id !== id));
          setMessage("Grade deleted successfully!");
        })
        .catch((error) => {
          const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
          setMessage(resMessage);
        });
    }
  };

  const isAdminOrInstructor = currentUser && (currentUser.roles.includes("ROLE_ADMIN") || currentUser.roles.includes("ROLE_INSTRUCTOR"));

  return (
    <div className="container mt-5">
      <h2>Assessment Grades</h2>
      {isAdminOrInstructor && (
        <Link to="/grades/new" className="btn btn-primary mb-3">
          Assign New Grade
        </Link>
      )}

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {grades.length === 0 && !message ? (
        <p>No grades found.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Grade</th>
              <th>Score</th>
              <th>Remarks</th>
              {isAdminOrInstructor && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.id}</td>
                <td><Link to={`/students/${grade.enrollment.student.id}`}>{grade.enrollment.student.firstName} {grade.enrollment.student.lastName}</Link> ({grade.enrollment.student.studentId})</td>
                <td><Link to={`/courses/${grade.enrollment.course.id}`}>{grade.enrollment.course.title}</Link> ({grade.enrollment.course.code})</td>
                <td>{grade.gradeValue}</td>
                <td>{grade.score}</td>
                <td>{grade.remarks}</td>
                {isAdminOrInstructor && (
                  <td>
                    <Link to={`/grades/edit/${grade.id}`} className="btn btn-warning btn-sm me-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(grade.id)} className="btn btn-danger btn-sm">
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

export default GradeList;