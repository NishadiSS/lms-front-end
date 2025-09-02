import React, { useEffect, useState } from 'react';
import authApi from '../api/auth.api';
import './HomePage.css';

const HomePage = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = authApi.retrieveCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <div className="home-page-container">
            <div className="home-page-content">
                <h1>University Learning Management System</h1>
                {currentUser ? (
                    <div className="mt-4">
                        <p>You are logged in as <strong>{currentUser.username}</strong> ({currentUser.roles ? currentUser.roles.join(', ') : 'No Roles'})</p>
                        <p>Explore the features based on your role.</p>
                        <a href="/courses" className="btn btn-primary mt-3">Go to Courses</a>
                    </div>
                ) : (
                    <div className="mt-4">
                        <p>Please <a href="/signin">Sign In</a> or <a href="/signup">Sign Up</a> to access the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;