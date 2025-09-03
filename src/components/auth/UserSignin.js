import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import authApi from "../../api/auth.api";
import './UserSignin.css'; 

const UserSignin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignin = (e) => {
    e.preventDefault();
    setMessage("");

    authApi.loginUser(username, password).then(
      () => {
        navigate("/courses");
        window.location.reload();
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
    <div className="signin-page-container"> 
      <div className="signin-card row"> 
        
        <div className="signin-form-section col-md-6">
          <h2 className="signin-title">Sign In</h2>
          <form onSubmit={handleSignin}>
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
            <button type="submit" className="btn btn-primary signin-button"> 
              Sign In
            </button>
            {message && (
              <div className="form-group mt-3">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </form>

          
        </div>

       
        <div className="welcome-section col-md-6 text-center d-flex flex-column justify-content-center align-items-center">
          <h2 className="welcome-title">Welcome to the LMS!</h2>
          <p className="welcome-text">
            Log in to manage your courses, view grades, and access essential university resources. We're here to help you succeed in your academic journey.
          </p>
          <p className="no-account-text">Don't have an account?  <Link to="/signup" className="signup-link">Register Now.</Link></p>
         
        </div>
      </div>
    </div>
  );
};

export default UserSignin;