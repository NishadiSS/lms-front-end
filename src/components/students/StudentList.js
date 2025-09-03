import React, { useState, useEffect } from "react";
import studentApi from "../../api/student.api"; 
import { Link } from "react-router-dom";
import authApi from "../../api/auth.api"; 

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser(); 
    if (user) {
      setCurrentUser(user);
    }

    studentApi.getAllStudents().then(
      (response) => {
        setStudents(response.data);
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
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      studentApi.deleteStudent(id).then(
        () => {
          setStudents(students.filter((student) => student.id !== id));
          setMessage("Student deleted successfully!");
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
  const isStudent = currentUser && currentUser.roles.includes("ROLE_STUDENT");
  const isInstructor = currentUser && currentUser.roles.includes("ROLE_INSTRUCTOR");

  
  const showRegisterButton = isAdmin || isInstructor || isStudent;


  let registerButtonText = "Register"; // Default text for Instructor and Student
  if (isAdmin) {
    registerButtonText = "Register New Student"; 
  }

  return (
    <div className="container mt-5">
      <h2>Registered Students</h2>
      {showRegisterButton && ( 
        <Link to="/students/new" className="btn btn-primary mb-3">
          {registerButtonText} 
        </Link>
      )}

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {students.length === 0 ? (
        <p>No students registered.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              {isAdmin && <th>Actions</th>} 
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.studentId}</td>
                <td><Link to={`/students/${student.id}`}>{student.firstName} {student.lastName}</Link></td>
                <td>{student.email}</td>
                {isAdmin && ( 
                  <td>
                    <Link to={`/students/edit/${student.id}`} className="btn btn-warning btn-sm me-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(student.id)} className="btn btn-danger btn-sm">
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

export default StudentList;