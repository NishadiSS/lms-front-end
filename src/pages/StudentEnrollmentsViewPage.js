
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import enrollmentService from "../services/enrollment.service"; 
import authService from "../services/auth.service"; 

const StudentEnrollmentsViewPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [studentIdInput, setStudentIdInput] = useState(""); 
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEnrollmentTable, setShowEnrollmentTable] = useState(false);
  const [isStudentProfileMissing, setIsStudentProfileMissing] = useState(false);
  const [isUnauthorizedToViewOtherStudent, setIsUnauthorizedToViewOtherStudent] = useState(false);

  const currentUser = authService.retrieveCurrentUser(); 
  const navigate = useNavigate();

  useEffect(() => {
   
    setMessage("");
    setIsStudentProfileMissing(false);
    setIsUnauthorizedToViewOtherStudent(false);
    setShowEnrollmentTable(false);
    setEnrollments([]);

   
    if (!currentUser || !currentUser.roles.includes("ROLE_STUDENT")) {
      setMessage("You must be logged in as a student to view enrollments.");
    
    }
  }, [currentUser, navigate]);

  const handleShowEnrollments = () => {
    setMessage(""); 
    setIsStudentProfileMissing(false);
    setIsUnauthorizedToViewOtherStudent(false);
    setIsLoading(true); 
    setShowEnrollmentTable(false); 

    if (!currentUser || !currentUser.roles.includes("ROLE_STUDENT")) {
      setMessage("Please log in as a student to view your enrollments.");
      setIsLoading(false);
      return;
    }

    if (!studentIdInput.trim()) { 
      setMessage("Please enter your Student ID to view enrollments.");
      setIsLoading(false);
      return;
    }

   
    enrollmentService.getEnrollmentsByProvidedStudentId(studentIdInput).then(
      (response) => {
        setEnrollments(response.data); 
        setShowEnrollmentTable(true); 
        setIsLoading(false);
        if (response.data.length === 0) {
          setMessage(`No enrollments found for Student ID: ${studentIdInput}.`);
        } else {
          setMessage(""); 
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

        
        if (error.response && error.response.status === 403) {
          setIsUnauthorizedToViewOtherStudent(true);
          setMessage(resMessage); 
        }
       
        else if (resMessage.includes("No student profile found for your user account.")) {
          setIsStudentProfileMissing(true);
          setMessage(resMessage); 
        }
       
        else {
          setMessage("Error loading enrollments: " + resMessage);
        }
        setShowEnrollmentTable(false); 
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
       
          {showEnrollmentTable && enrollments.length === 0 && !message && !isLoading && (
             <p className="alert alert-info mt-3">No enrollments found for Student ID: {studentIdInput}.</p>
          )}
        </>
      ) : (
       
        <div className="alert alert-info mt-3" role="alert">
          Please log in as a student to view your enrollments.
        </div>
      )}
    </div>
  );
};

export default StudentEnrollmentsViewPage;