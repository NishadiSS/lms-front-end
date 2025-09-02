import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instructorApi from "../../api/instructor.api";
import authApi from "../../api/auth.api";

const InstructorForm = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const [instructorData, setInstructorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userId: null, // For linking with an existing user, mainly for Admin
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
      instructorApi.getInstructorById(id).then(
        (response) => {
          setInstructorData(response.data);
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
    setInstructorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const dataToSubmit = isEditMode
      ? { firstName: instructorData.firstName, lastName: instructorData.lastName, email: instructorData.email }
      : instructorData;

    const action = isEditMode
      ? instructorApi.updateInstructor(id, dataToSubmit)
      : instructorApi.createInstructor(dataToSubmit);

    action.then(
      () => {
        navigate("/instructors");
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

  const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");

  return (
    <div className="container mt-5">
      <h2>{isEditMode ? "Edit Instructor Profile" : "Add New Instructor"}</h2>
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
            value={instructorData.firstName}
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
            value={instructorData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={instructorData.email}
            onChange={handleChange}
            required
          />
        </div>
        {!isEditMode && isAdmin && ( // Admin can link to existing user on creation
          <div className="form-group mb-3">
            <label htmlFor="userId">Link to User ID (Optional, Admin only)</label>
            <input
              type="number"
              className="form-control"
              id="userId"
              name="userId"
              value={instructorData.userId || ""}
              onChange={handleChange}
              placeholder="Enter User ID if linking"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Profile" : "Add Instructor"}
        </button>
        <button type="button" onClick={() => navigate("/instructors")} className="btn btn-secondary ms-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default InstructorForm;