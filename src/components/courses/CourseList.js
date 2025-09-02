import React, { useState, useEffect } from "react";
import courseApi from "../../api/course.api";
import { Link } from "react-router-dom";
import authApi from "../../api/auth.api";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    courseApi.getAllCourses().then(
      (response) => {
        setCourses(response.data);
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
    if (window.confirm("Are you sure you want to delete this course?")) {
      courseApi.deleteCourse(id).then(
        () => {
          setCourses(courses.filter((course) => course.id !== id));
          setMessage("Course deleted successfully!");
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

  return (
    <div className="container mt-5">
      <h2>Available Courses</h2>
      {isAdmin && (
        <Link to="/courses/new" className="btn btn-primary mb-3">
          Add New Course
        </Link>
      )}

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Title</th>
              <th>Description</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.code}</td>
                <td>
                  <Link to={`/courses/${course.id}`}>{course.title}</Link>
                </td>
                <td>{course.description}</td>
                {isAdmin && (
                  <td>
                    <Link to={`/courses/edit/${course.id}`} className="btn btn-warning btn-sm me-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(course.id)} className="btn btn-danger btn-sm">
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

export default CourseList;