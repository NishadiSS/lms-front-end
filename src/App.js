import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import AppNavbar from "./components/layout/AppNavbar"; 
import UserSignin from "./components/auth/UserSignin";
import UserSignup from "./components/auth/UserSignup";
import CourseList from "./components/courses/CourseList";
import authService from "./api/auth.api"; 
import HomePage from "./pages/HomePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// -- New Components Imports --
import StudentList from "./components/students/StudentList";
import StudentDetails from "./components/students/StudentDetails";
import StudentForm from "./components/students/StudentForm";

import InstructorList from "./components/instructors/InstructorList";
import InstructorDetails from "./components/instructors/InstructorDetails";
import InstructorForm from "./components/instructors/InstructorForm";

import EnrollmentList from "./components/enrollments/EnrollmentList";
import EnrollmentDetails from "./components/enrollments/EnrollmentDetails";
import EnrollmentForm from "./components/enrollments/EnrollmentForm";

import GradeList from "./components/grades/GradeList";
import GradeDetails from "./components/grades/GradeDetails";
import GradeForm from "./components/grades/GradeForm";
import CourseDetails from "./components/courses/CourseDetails";
import CourseForm from "./components/courses/CourseForm";

// -- Custom Page Imports (as per discussion) --
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage"; 

const ProtectedRoute = ({ children, roles }) => {
  const currentUser = authService.retrieveCurrentUser();

  if (!currentUser) {
    return <Navigate to="/signin" replace />; 
  }

  const userRoles = currentUser.roles || [];
  const hasRequiredRole = roles.some(role => userRoles.includes(role.toUpperCase()));

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />; 
  }

  return children;
};

function App() {
  const currentUser = authService.retrieveCurrentUser();
  const isStudent = currentUser && currentUser.roles.includes("ROLE_STUDENT");

  return (
    <Router>
      <AppNavbar />
      <div className="container mt-3">
        <Routes>
          {/* Root Path Redirection Logic */}
          <Route 
            path="/" 
            element={
              currentUser ? ( // If logged in
                isStudent ? ( // If a student, go to MyEnrollmentsPage
                  <Navigate to="/my-enrollments" replace />
                ) : ( // If not a student (admin/instructor), go to CourseList
                  <Navigate to="/courses" replace />
                )
              ) : ( // If not logged in, show HomePage
                <HomePage />
              )
            } 
          />
          
          <Route path="/signin" element={<UserSignin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* My Enrollments Page - Students Only */}
          <Route
            path="/my-enrollments"
            element={
              <ProtectedRoute roles={["ROLE_STUDENT"]}>
                <MyEnrollmentsPage />
              </ProtectedRoute>
            }
          />

          {/* Enroll in a Course Page - For students to enroll in courses */}
        
          <Route
            path="/enroll-course" 
            element={
              <ProtectedRoute roles={["ROLE_STUDENT"]}>
                <EnrollmentForm /> 
              </ProtectedRoute>
            }
          />

          {/* Course Routes */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute roles={["ROLE_STUDENT", "ROLE_INSTRUCTOR", "ROLE_ADMIN"]}>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/new"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute roles={["ROLE_STUDENT", "ROLE_INSTRUCTOR", "ROLE_ADMIN"]}>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/edit/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <CourseForm />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"]}>
                <StudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/new"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN","ROLE_INSTRUCTOR","ROLE_STUDENT"]}>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"]}>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_STUDENT"]}> 
                <StudentForm />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructors"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"]}>
                <InstructorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructors/new"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <InstructorForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructors/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"]}>
                <InstructorDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructors/edit/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR"]}>
                <InstructorForm />
              </ProtectedRoute>
            }
          />

          {/* Enrollment Routes */}
          <Route
            path="/enrollments"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_STUDENT","ROLE_INSTRUCTOR"]}>
                <EnrollmentList />
              </ProtectedRoute>
            }
          />
       
          <Route
            path="/enrollments/new"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR"]}> 
                <EnrollmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrollments/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"]}>
                <EnrollmentDetails />
              </ProtectedRoute>
            }
          />

          {/* Grade Routes */}
          <Route
            path="/grades"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"]}>
                <GradeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grades/new/:enrollmentId?"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR"]}>
                <GradeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grades/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"]}>
                <GradeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grades/edit/:id"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_INSTRUCTOR"]}>
                <GradeForm />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;