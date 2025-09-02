import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate import කරන්න
import enrollmentService from "../services/enrollment.service";
import authService from "../services/auth.service"; // ඔබගේ auth.service ගොනුවට නිවැරදි path එක යොදන්න.

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEnrollmentTable, setShowEnrollmentTable] = useState(false); // Table එක පෙන්විය යුතුද යන්න පාලනය කරයි
  const [isStudentProfileMissing, setIsStudentProfileMissing] = useState(false); // Student profile එක නැති විට පෙන්වීමට

  const currentUser = authService.getCurrentUser(); // දැනට ලොග් වී සිටින user ලබා ගනී
  const navigate = useNavigate(); // Navigation සඳහා

  useEffect(() => {
    // Component mount වන විට හෝ currentUser වෙනස් වන විට මුල් තත්ත්වය සකසන්න
    // මෙම පිටුවට එන විට message clear කර, table එක නොපෙන්වා තබයි.
    setMessage("");
    setIsStudentProfileMissing(false);
    setShowEnrollmentTable(false);

    // ශිෂ්‍යයෙක් නොවේ නම් හෝ log වී නොමැති නම් redirect කරන්න
    if (!currentUser || !currentUser.roles.includes("ROLE_STUDENT")) {
        setMessage("You must be logged in as a student to view your enrollments.");
        // optionally navigate to login or home page
        // navigate("/login");
    }
  }, [currentUser, navigate]); // currentUser හෝ navigate වෙනස් වන විට useEffect නැවත ක්‍රියාත්මක වේ

  const handleViewMyEnrollments = () => {
    setMessage(""); // පෙර තිබූ messages clear කරන්න
    setIsStudentProfileMissing(false); // පෙර තිබූ profile missing alert clear කරන්න
    setIsLoading(true); // Loading state පෙන්වීමට

    if (!currentUser || !currentUser.roles.includes("ROLE_STUDENT")) {
      setMessage("Please log in as a student to view your enrollments.");
      setIsLoading(false);
      return;
    }

    enrollmentService.getMyEnrolledCourses().then(
      (response) => {
        setEnrollments(response.data);
        setShowEnrollmentTable(true); // Table එක පෙන්වීමට සකසන්න
        setIsLoading(false);
        if (response.data.length === 0) {
            setMessage("You are currently not enrolled in any courses.");
        }
      },
      (error) => {
        setIsLoading(false);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        // Backend එකෙන් "No student profile found" message එක එන්නේ නම් එය හඳුනා ගන්න
        if (resMessage.includes("No student profile found for your user account.")) {
          setIsStudentProfileMissing(true);
        } else {
          setMessage("Error loading enrollments: " + resMessage);
        }
        setShowEnrollmentTable(false); // දෝෂයක් ඇති වුවහොත් table එක නොපෙන්වන්න
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <h2>Course Enrollments</h2>
        <div className="alert alert-info">Loading your enrollments...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Course Enrollments</h2>

      {/* Enroll in a Course button - මෙය අදාළ පිටුවට link විය යුතුය */}
      {currentUser && currentUser.roles.includes("ROLE_STUDENT") && (
        <Link to="/enroll-course" className="btn btn-primary mb-3 me-2"> {/* මෙම path එක ඔබගේ enrollment form එකේ path එකට වෙනස් කරන්න */}
          Enroll in a Course
        </Link>
      )}
      
      {/* View My Enrollments button */}
      {currentUser && currentUser.roles.includes("ROLE_STUDENT") && (
        <button onClick={handleViewMyEnrollments} className="btn btn-secondary mb-3">
          View My Enrollments
        </button>
      )}

      {/* Student profile එක නැති විට පෙන්වන message එක */}
      {isStudentProfileMissing && (
        <div className="alert alert-danger" role="alert">
          No student profile found for your user account. Please contact admin.
        </div>
      )}

      {/* අනෙකුත් දෝෂ හෝ තොරතුරු messages */}
      {message && !isStudentProfileMissing && ( // profile missing message එක නැති විට පමණක් පෙන්වන්න
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {/* Enrollments table එක */}
      {showEnrollmentTable && enrollments.length > 0 && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Enrollment Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.id}</td>
                <td>{enrollment.student.firstName} {enrollment.student.lastName} ({enrollment.student.studentId})</td>
                <td>{enrollment.course.title} ({enrollment.course.code})</td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Table header එක පෙන්වීමට, දත්ත නොමැති වුවත්, නමුත් showEnrollmentTable true නම් */}
      {showEnrollmentTable && enrollments.length === 0 && !message && (
        <p>You are currently not enrolled in any courses.</p>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;