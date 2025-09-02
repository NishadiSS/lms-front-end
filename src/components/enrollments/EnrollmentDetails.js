import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import enrollmentApi from "../../api/enrollment.api";
import authApi from "../../api/auth.api";
import { Link } from "react-router-dom";

const EnrollmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    enrollmentApi.getEnrollmentById(id).then(
      (response) => {
        setEnrollment(response.data);
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
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      enrollmentApi.deleteEnrollment(id).then(
        () => {
          navigate("/enrollments");
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
  // const isOwner = currentUser && enrollment && currentUser.id === enrollment.student.userId; // Backend securityUtils handles this
  // You might not need to check isOwner here if backend handles authorization properly.

  if (!enrollment) {
    return (
      <div className="container mt-5">
        {message ? (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        ) : (
          <p>Loading enrollment details...</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Enrollment Details</h2>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
      <div className="card">
        <div className="card-header">Enrollment ID: {enrollment.id}</div>
        <div className="card-body">
          <p>
            <strong>Student:</strong>{" "}
            <Link to={`/students/${enrollment.student.id}`}>
              {enrollment.student.firstName} {enrollment.student.lastName} ({enrollment.student.studentId})
            </Link>
          </p>
          <p>
            <strong>Course:</strong>{" "}
            <Link to={`/courses/${enrollment.course.id}`}>
              {enrollment.course.title} ({enrollment.course.code})
            </Link>
          </p>
          <p>
            <strong>Enrollment Date:</strong> {new Date(enrollment.enrollmentDate).toLocaleString()}
          </p>
          {isAdmin && ( // Only admin can delete via this view
            <div className="mt-3">
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Enrollment
              </button>
            </div>
          )}
          <button onClick={() => navigate("/enrollments")} className="btn btn-secondary mt-3">
            Back to Enrollments
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetails;