import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/auth.api";

const AppNavbar = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authApi.retrieveCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    authApi.logoutUser();
    setCurrentUser(undefined);
    navigate("/signin");
    window.location.reload();
  };

  const showAdminBoard = currentUser && currentUser.roles.includes("ROLE_ADMIN");
  const showInstructorBoard = currentUser && currentUser.roles.includes("ROLE_INSTRUCTOR");
  const showStudentBoard = currentUser && currentUser.roles.includes("ROLE_STUDENT");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          LMS App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/courses" className="nav-link">
                Courses
              </Link>
            </li>
            {showStudentBoard && (
              <li className="nav-item">
                  <Link to="/students" className="nav-link">
                    Students
                  </Link>
                </li>
            )}

            {showStudentBoard && (
            <li className="nav-item">
              <Link to="/my-enrollments" className="nav-link">
                My Enrollments
              </Link>
            </li>
          )}
             {showStudentBoard && (
              <li className="nav-item">
                <Link to="/grades" className="nav-link">
                  My Grades
                </Link>
              </li>
            )}

             

            {showInstructorBoard && (
              <>
                <li className="nav-item">
                  <Link to="/students" className="nav-link">
                    Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/enrollments" className="nav-link">
                    Enrollments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/grades" className="nav-link">
                    Grades
                  </Link>
                </li>
                {/* Courses can also be managed by instructors if logic is built */}
              </>
            )}

            {showAdminBoard && (
              <>
                <li className="nav-item">
                  <Link to="/students" className="nav-link">
                    Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/instructors" className="nav-link">
                    Instructors
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/enrollments" className="nav-link">
                    Enrollments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/grades" className="nav-link">
                    Grades
                  </Link>
                </li>
                {/* Admin can also manage courses (already in App.js) */}
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {currentUser.username}</span>
                </li>
                <li className="nav-item">
                  <a href="/signin" className="nav-link" onClick={handleLogout}>
                    Sign Out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/signin" className="nav-link">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;