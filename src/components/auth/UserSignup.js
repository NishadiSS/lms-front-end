import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import authApi from "../../api/auth.api";
import './UserSignup.css'; 

const UserSignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setMessage("");

    // authApi.registerUser expects roles as an array, even if it's a single role
    authApi.registerUser(username, email, password, role).then( 
      (response) => {
        setMessage(response.data.message || "Registration successful!");
        navigate("/signin"); 
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
  };

  return (
    <div className="signup-page-container"> 
      <div className="signup-card row"> 
       
        <div className="signup-form-section col-md-6">
          <h2 className="signup-title">Register for LMS</h2> 
          <form onSubmit={handleSignup}>
            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="role">Role</label>
              <select
                className="form-control"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success signup-button"> 
              Sign Up
            </button>
            {message && (
              <div className="form-group mt-3">
                <div className="alert alert-info" role="alert">
                  {message}
                </div>
              </div>
            )}
          </form>

         
        </div>

        
        <div className="welcome-section col-md-6 text-center d-flex flex-column justify-content-center align-items-center">
          <h2 className="welcome-title">Join Our University LMS!</h2> 
          <p className="welcome-text">
            Create an account to access your courses, manage enrollments, and stay updated with academic activities. {/* Text එක වෙනස් කර ඇත */}
          </p>
          <p className="no-account-text">Already have an account? <Link to="/signin" className="signup-link">Sign In here.</Link></p> {/* Signin prompt එක වෙනස් කර ඇත */}
          
        </div>
      </div>
    </div>
  );
};

export default UserSignup;