import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentApi from "../../api/student.api";
import authApi from "../../api/auth.api";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    userId: null,
  });
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    if (id) {
      setIsEditMode(true);
      studentApi.getStudentById(id).then(
        (response) => {
          setStudentData(response.data);
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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const dataToSubmit = isEditMode
      ? { firstName: studentData.firstName, lastName: studentData.lastName, email: studentData.email }
      : studentData;

    const action = isEditMode
      ? studentApi.updateStudent(id, dataToSubmit)
      : studentApi.createStudent(dataToSubmit);

    action.then(
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
        console.error("Error registering student:", error);
      }
    );
  };

  const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");
  const isInstructor = currentUser && currentUser.roles.includes("ROLE_INSTRUCTOR");
  const isStudent = currentUser && currentUser.roles.includes("ROLE_STUDENT");

  const isAdminOrInstructorOrStudent = isAdmin || isInstructor || isStudent;

  return (
    <div className="container mt-5">
      <h2>{isEditMode ? "Edit Student Profile" : "Register New Student"}</h2>
      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={studentData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={studentData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        {!isEditMode && isAdminOrInstructorOrStudent && (
          <div className="form-group mb-3">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              className="form-control"
              id="studentId"
              name="studentId"
              value={studentData.studentId}
              onChange={handleChange}
              required={!isEditMode}
            />
          </div>
        )}
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
            required
          />
        </div>
        {!isEditMode && isAdminOrInstructorOrStudent && (
          <div className="form-group mb-3">
            <label htmlFor="userId">Link to User ID (Optional, Admin/Instructor only)</label>
            <input
              type="number"
              className="form-control"
              id="userId"
              name="userId"
              value={studentData.userId || ""}
              onChange={handleChange}
              placeholder="Enter User ID if linking"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Profile" : "Register Student"}
        </button>
        <button type="button" onClick={() => navigate("/students")} className="btn btn-secondary ms-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default StudentForm;