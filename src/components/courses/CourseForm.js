import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseApi from "../../api/course.api";

const CourseForm = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    code: "",
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      courseApi.getCourseById(id).then(
        (response) => {
          setCourseData(response.data);
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
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const action = isEditMode
      ? courseApi.updateCourse(id, courseData)
      : courseApi.createCourse(courseData);

    action.then(
      () => {
        navigate("/courses");
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
    <div className="container mt-5">
      <h2>{isEditMode ? "Edit Course" : "Add New Course"}</h2>
      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="code">Course Code</label>
          <input
            type="text"
            className="form-control"
            id="code"
            name="code"
            value={courseData.code}
            onChange={handleChange}
            required
            disabled={isEditMode} 
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="title">Course Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Course" : "Create Course"}
        </button>
        <button type="button" onClick={() => navigate("/courses")} className="btn btn-secondary ms-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CourseForm;