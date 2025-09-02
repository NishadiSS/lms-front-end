import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instructorApi from "../../api/instructor.api";
import authApi from "../../api/auth.api";

const InstructorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    instructorApi.getInstructorById(id).then(
      (response) => {
        setInstructor(response.data);
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
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      instructorApi.deleteInstructor(id).then(
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
    }
  };

  const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");
  const isOwner = currentUser && instructor && currentUser.id === instructor.userId; // Check if current user is the owner

  if (!instructor) {
    return (
      <div className="container mt-5">
        {message ? (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        ) : (
          <p>Loading instructor details...</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Instructor Details</h2>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
      <div className="card">
        <div className="card-header">Instructor: {instructor.firstName} {instructor.lastName}</div>
        <div className="card-body">
          <p>
            <strong>ID:</strong> {instructor.id}
          </p>
          <p>
            <strong>Name:</strong> {instructor.firstName} {instructor.lastName}
          </p>
          <p>
            <strong>Email:</strong> {instructor.email}
          </p>
          {(isAdmin || isOwner) && (
            <div className="mt-3">
              <button onClick={() => navigate(`/instructors/edit/${instructor.id}`)} className="btn btn-warning me-2">
                Edit Profile
              </button>
              {isAdmin && (
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete Instructor
                </button>
              )}
            </div>
          )}
          <button onClick={() => navigate("/instructors")} className="btn btn-secondary mt-3">
            Back to Instructors
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;