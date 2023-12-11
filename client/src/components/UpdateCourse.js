import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ErrorsDisplay from "./ErrorsDisplay";
import UserContext from "../context/UserContext";

const UpdateCourse = () => {
  const { id } = useParams();
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Current course state
  const [course, setCourse] = useState({});

  // state for handling form changes
  const [errors, setErrors] = useState([]);
  const [updatedCourse, setUpdatedCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    userId: authUser.id,
  });

  // If course doesn't exist, navigate to notfound route
  if (!course) {
    navigate("/notfound");
    // otherwise if auth user is not course owner, navigate to forbidden route
  } else if (authUser.id !== course.userId) {
    navigate("/forbidden");
  }

  // Fetch course info
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (response.status === 200) {
          const data = await response.json();
          setCourse(data);
          setUpdatedCourse(data);
        }
      } catch (error) {
        console.error("Error fetching course");
        navigate("/error");
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // event handlers
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!course) {
      navigate("/notfound");
    }

    // use btoa method to encode user credentials
    const encodedCredentials = btoa(
      `${authUser.emailAddress}:${authUser.password}`
    );

    const fetchOptions = {
      method: "PUT",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(updatedCourse),
    };

    // Send PUT request
    try {
      if (authUser && authUser.id === course.userId) {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`,
          fetchOptions
        );
        // If successfully updated, navigate to course detail page
        if (response.status === 204) {
          console.log(`${course.title} was successfully updated!`);
          navigate(`/courses/${id}`);
          // Set errors for missing title and/or description
        } else if (response.status === 400) {
          const data = await response.json();
          setErrors(data.errors);
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  if (course) {
    return (
      <div className="wrap">
        <h2>Update Course</h2>
        <ErrorsDisplay errors={errors} />
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="courseTitle"
                type="text"
                value={updatedCourse.title}
                onChange={(e) =>
                  setUpdatedCourse({ ...updatedCourse, title: e.target.value })
                }
              />
              {course.User && (
                <p>
                  By {course.User.firstName} {course.User.lastName}
                </p>
              )}
              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                type="text"
                value={updatedCourse.description}
                onChange={(e) =>
                  setUpdatedCourse({
                    ...updatedCourse,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={updatedCourse.estimatedTime}
                onChange={(e) =>
                  setUpdatedCourse({
                    ...updatedCourse,
                    estimatedTime: e.target.value,
                  })
                }
              />
              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                value={updatedCourse.materialsNeeded}
                onChange={(e) =>
                  setUpdatedCourse({
                    ...updatedCourse,
                    materialsNeeded: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <button className="button" type="submit" onClick={handleSubmit}>
            Update Course
          </button>
          <button className="button button-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    );
  }
  navigate("/notfound");
};

export default UpdateCourse;
