import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseApi from "../../api/course.api";
import authApi from "../../api/auth.api";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    courseApi.getCourseById(id).then(
      (response) => {
        setCourse(response.data);
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
    if (window.confirm("Are you sure you want to delete this course?")) {
      courseApi.deleteCourse(id).then(
        () => {
          navigate("/courses");
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

  if (!course) {
    return (
      <div className="container mt-5">
        {message ? (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Course Details</h2>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
      <div className="card">
        <div className="card-header">Course: {course.title}</div>
        <div className="card-body">
          <p>
            <strong>ID:</strong> {course.id}
          </p>
          <p>
            <strong>Code:</strong> {course.code}
          </p>
          <p>
            <strong>Title:</strong> {course.title}
          </p>
          <p>
            <strong>Description:</strong> {course.description}
          </p>
          {isAdmin && (
            <div className="mt-3">
              <button onClick={() => navigate(`/courses/edit/${course.id}`)} className="btn btn-warning me-2">
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
          <button onClick={() => navigate("/courses")} className="btn btn-secondary mt-3">
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;