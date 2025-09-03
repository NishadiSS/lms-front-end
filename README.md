# LMS Frontend (React.js)

This repository hosts the React.js frontend application for the University Course Management System. It provides an interactive and responsive user interface for managing courses, users, and enrollments, communicating securely with the backend API.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
  - [Configuration](#configuration)
  - [Run Application](#run-application)
- [Deployment](#deployment)
- [License](#license)

## Features

-   **User Authentication**: Login and registration forms with JWT-based authentication.
-   **Role-Based Access**: Dynamically protected routes and UI elements based on user roles (Student, Instructor, Admin).
-   **Course Management Interface**: Displaying available courses. (Extendable for CRUD forms).
-   **Responsive Design**: Built with Bootstrap 5 for optimal viewing on various devices.
-   **API Integration**: Secure communication with the Spring Boot backend using Axios.

## Technology Stack

-   **Frontend**: React.js (Create React App), JavaScript (ES6+), npm.
-   **Routing**: React Router DOM.
-   **Styling**: Bootstrap 5, Custom CSS.
-   **API Client**: Axios.
-   **Development Tools**: VS Code.

## Prerequisites

-   Node.js (v16+)
-   npm (Node Package Manager)
-   Git
-   The LMS Backend application (running locally or deployed).

## Local Setup

### Configuration

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/lms-front-end.git # Replace with your actual repo URL
    cd lms_front_end
    ```
2.  **Environment Variables**: Create a `.env` file in the root of the `lms_front_end` project (or `.env.development` / `.env.production`) and add your backend API base URL:
    ```
    REACT_APP_API_BASE_URL=http://localhost:8080/api
    # Or, if your backend is deployed:
    # REACT_APP_API_BASE_URL=https://lms-back-end-production-9099.up.railway.app
    ```
    **IMPORTANT**: Ensure `REACT_APP_API_BASE_URL` matches your backend's actual URL.

### Run Application

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm start
    ```
    The frontend application will open in your browser at `http://localhost:3000`.

## Deployment

The frontend application is designed for static site deployment.

-   **Process**: Integrated with GitHub, pushing new code to the `main` branch automatically triggers a build (`npm run build`) and deploys the static assets.
-   **Production URL**: `https://lms-front-end-production.up.railway.app` (This should match the URL configured in your backend's CORS settings).

## License

This project is licensed under the MIT License.
