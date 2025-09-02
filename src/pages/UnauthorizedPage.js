import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="container mt-5 text-center">
            <h1 className="text-danger">403 - Unauthorized Access</h1>
            <p className="lead">You do not have permission to view this page.</p>
            <p>Please contact an administrator if you believe this is an error, or go back to the <Link to="/">Home Page</Link>.</p>
            <Link to="/courses" className="btn btn-primary mt-3">Go to Courses</Link>
        </div>
    );
};

export default UnauthorizedPage;