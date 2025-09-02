// lms_front_end/src/pages/StudentEnrollmentsViewPage.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import enrollmentService from "../services/enrollment.service"; // ඔබගේ enrollment.service ගොනුවට නිවැරදි path එක යොදන්න.
import authService from "../services/auth.service"; // ඔබගේ auth.service ගොනුවට නිවැරදි path එක යොදන්න.

const StudentEnrollmentsViewPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [studentIdInput, setStudentIdInput] = useState(""); // Student ID input field එක සඳහා state එක
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEnrollmentTable, setShowEnrollmentTable] = useState(false);
  const [isStudentProfileMissing, setIsStudentProfileMissing] = useState(false);
  const [isUnauthorizedToViewOtherStudent, setIsUnauthorizedToViewOtherStudent] = useState(false);

  const currentUser = authService.retrieveCurrentUser(); // ඔබගේ auth.service හි retrieveCurrentUser() භාවිතා කරන්න.
  const navigate = useNavigate();

  useEffect(() => {
    // Initial load/user change මත states clear කරන්න
    setMessage("");
    setIsStudentProfileMissing(false);
    setIsUnauthorizedToViewOtherStudent(false);
    setShowEnrollmentTable(false);
    setEnrollments([]);

    // පරිශීලකයා ශිෂ්‍යයෙක් නොවේ නම් log වී නොමැති නම් පණිවිඩයක් පෙන්වන්න.
    if (!currentUser || !currentUser.roles.includes("ROLE_STUDENT")) {
      setMessage("You must be logged in as a student to view enrollments.");
      // ProtectedRoute මගින් redirection සිදුවන නමුත්, මෙය fallback message එකකි.
    }
  }, [currentUser, navigate]);

  const handleShowEnrollments = () => {
    setMessage(""); // පෙර තිබූ messages clear කරන්න
    setIsStudentProfileMissing(false);
    setIsUnauthorizedToViewOtherStudent(false);
    setIsLoading(true); // Loading state පෙන්වීමට
    setShowEnrollmentTable(false); // නව දත්ත fetch කරන තුරු table එක සඟවන්න

    if (!currentUser || !currentUser.roles.includes("ROLE_STUDENT")) {
      setMessage("Please log in as a student to view your enrollments.");
      setIsLoading(false);
      return;
    }

    if (!studentIdInput.trim()) { // input field එක හිස්දැයි පරීක්ෂා කරන්න
      setMessage("Please enter your Student ID to view enrollments.");
      setIsLoading(false);
      return;
    }

    // Backend endpoint එකට Student ID එක යවා enrollments ලබා ගනී
    enrollmentService.getEnrollmentsByProvidedStudentId(studentIdInput).then(
      (response) => {
        setEnrollments(response.data); // ලැබෙන දත්ත enrollments state එකට සකසයි
        setShowEnrollmentTable(true); // Table එක පෙන්වීමට සකසයි
        setIsLoading(false);
        if (response.data.length === 0) {
          setMessage(`No enrollments found for Student ID: ${studentIdInput}.`);
        } else {
          setMessage(""); // සාර්ථක නම් message එක clear කරයි
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

        // Backend එකෙන් 403 Forbidden status එකක් ලැබුණොත් (අවසර නැතිනම්)
        if (error.response && error.response.status === 403) {
          setIsUnauthorizedToViewOtherStudent(true);
          setMessage(resMessage); // Backend හි නිශ්චිත unauthorized message එක display කරන්න
        }
        // Backend එකෙන් "No student profile found" message එක එන්නේ නම්
        else if (resMessage.includes("No student profile found for your user account.")) {
          setIsStudentProfileMissing(true);
          setMessage(resMessage); // Backend හි නිශ්චිත missing profile message එක display කරන්න
        }
        // වෙනත් දෝෂයක් නම්
        else {
          setMessage("Error loading enrollments: " + resMessage);
        }
        setShowEnrollmentTable(false); // දෝෂයක් ඇති වුවහොත් table එක නොපෙන්වන්න
      }
    );
  };

  return (
    <div className="container mt-5">
      <h2>My Enrolled Courses</h2>

      {currentUser && currentUser.roles.includes("ROLE_STUDENT") ? (
        <>
          {/* Student ID Input Field */}
          <div className="mb-3">
            <label htmlFor="studentIdInput" className="form-label">
              Enter Your Student ID:
            </label>
            <input
              type="text"
              className="form-control"
              id="studentIdInput"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              placeholder="e.g., S001"
            />
          </div>

          {/* Enrollments display කිරීමට බොත්තම */}
          <button onClick={handleShowEnrollments} className="btn btn-primary mb-3">
            Show Enrolled Courses
          </button>

          {isLoading && (
            <div className="alert alert-info mt-3">Loading your enrollments...</div>
          )}

          {/* Error/Information Messages */}
          {isStudentProfileMissing && (
            <div className="alert alert-danger mt-3" role="alert">
              {message}
            </div>
          )}

          {isUnauthorizedToViewOtherStudent && (
            <div className="alert alert-warning mt-3" role="alert">
              {message}
            </div>
          )}

          {message && !isStudentProfileMissing && !isUnauthorizedToViewOtherStudent && (
            <div className="alert alert-info mt-3" role="alert">
              {message}
            </div>
          )}

          {/* Enrollments Table */}
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
          {/* search කිරීමෙන් පසු enrollments නොමැති විට පෙන්වන පණිවිඩය */}
          {showEnrollmentTable && enrollments.length === 0 && !message && !isLoading && (
             <p className="alert alert-info mt-3">No enrollments found for Student ID: {studentIdInput}.</p>
          )}
        </>
      ) : (
        // ශිෂ්‍යයෙකු ලෙස log වී නොමැති නම් පෙන්වන පණිවිඩය (ProtectedRoute මගින් හැසිරවිය යුතුය, නමුත් මෙය fallback එකකි)
        <div className="alert alert-info mt-3" role="alert">
          Please log in as a student to view your enrollments.
        </div>
      )}
    </div>
  );
};

export default StudentEnrollmentsViewPage;