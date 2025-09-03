import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import enrollmentApi from "../../api/enrollment.api";
import studentApi from "../../api/student.api";
import courseApi from "../../api/course.api";
import authApi from "../../api/auth.api";

const EnrollmentForm = () => {
  const navigate = useNavigate();
  const [enrollmentData, setEnrollmentData] = useState({
    studentId: "",
    courseId: "",
  });
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);

      // If current user is a student, pre-fill their student ID
      if (user.roles.includes("ROLE_STUDENT")) {
          studentApi.getAllStudents().then(res => {
              const currentStudent = res.data.find(s => s.userId === user.id);
              if (currentStudent) {
                
                  setEnrollmentData(prev => ({...prev, studentId: currentStudent.id.toString()}));
              } else {
                  setMessage("Error: No student profile found for your user account.");
              }
          }).catch(err => console.error("Error fetching student profile:", err));
      }
    }

    // Fetch all students (if admin/instructor)
    studentApi.getAllStudents().then(
      (response) => {
        setStudents(response.data);
      },
      (error) => {
        console.error("Error fetching students:", error);
      }
    );

    // Fetch all courses
    courseApi.getAllCourses().then(
      (response) => {
        setCourses(response.data);
      },
      (error) => {
        console.error("Error fetching courses:", error);
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const dataToSubmit = {
      studentId: parseInt(enrollmentData.studentId, 10), // String to Integer conversion
      courseId: parseInt(enrollmentData.courseId, 10),   // String to Integer conversion
    };

    enrollmentApi.enrollStudentInCourse(dataToSubmit).then(
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
        console.error("Error enrolling student:", error);
      }
    );
  };

  //const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");
  const isStudent = currentUser && currentUser.roles.includes("ROLE_STUDENT");
  //const isInstructor = currentUser && currentUser.roles.includes("ROLE_INSTRUCTOR");


  return (
    <div className="container mt-5">
      <h2>Enroll in a Course</h2>
      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="studentId">Student</label>
          <select
            className="form-control"
            id="studentId"
            name="studentId"
            value={enrollmentData.studentId}
            onChange={handleChange}
            required
            disabled={isStudent && enrollmentData.studentId !== ""}
          >
            <option value="">Select a Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id.toString()}> 
                {student.firstName} {student.lastName} ({student.studentId})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="courseId">Course</label>
          <select
            className="form-control"
            id="courseId"
            name="courseId"
            value={enrollmentData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id.toString()}> 
                {course.title} ({course.code})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Enroll
        </button>
        <button type="button" onClick={() => navigate("/enrollments")} className="btn btn-secondary ms-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EnrollmentForm;