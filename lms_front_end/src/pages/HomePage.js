import React, { useEffect, useState } from 'react';
import authApi from '../api/auth.api'; // Path to auth.api

const HomePage = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = authApi.retrieveCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <div className="container mt-5 text-center">
            <h1>Welcome to the LMS App!</h1>
            {currentUser ? (
                <div className="mt-4">
                    <p>You are logged in as <strong>{currentUser.username}</strong> ({currentUser.userRoles ? currentUser.userRoles.join(', ') : 'No Roles'})</p>
                    <p>Explore the features based on your role.</p>
                </div>
            ) : (
                <div className="mt-4">
                    <p>Please <a href="/signin">Sign In</a> or <a href="/signup">Sign Up</a> to access the system.</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;