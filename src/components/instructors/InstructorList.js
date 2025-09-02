import React, { useState, useEffect } from "react";
import instructorApi from "../../api/instructor.api";
import { Link } from "react-router-dom";
import authApi from "../../api/auth.api";

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    instructorApi.getAllInstructors().then(
      (response) => {
        setInstructors(response.data);
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
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      instructorApi.deleteInstructor(id).then(
        () => {
          setInstructors(instructors.filter((instructor) => instructor.id !== id));
          setMessage("Instructor deleted successfully!");
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
      <h2>Registered Instructors</h2>
      {isAdmin && (
        <Link to="/instructors/new" className="btn btn-primary mb-3">
          Add New Instructor
        </Link>
      )}

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {instructors.length === 0 ? (
        <p>No instructors registered.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.id}>
                <td>{instructor.id}</td>
                <td><Link to={`/instructors/${instructor.id}`}>{instructor.firstName} {instructor.lastName}</Link></td>
                <td>{instructor.email}</td>
                {isAdmin && (
                  <td>
                    <Link to={`/instructors/edit/${instructor.id}`} className="btn btn-warning btn-sm me-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(instructor.id)} className="btn btn-danger btn-sm">
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

export default InstructorList;