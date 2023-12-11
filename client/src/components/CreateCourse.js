import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorsDisplay from "./ErrorsDisplay";
import UserContext from "../context/UserContext";

const CreateCourse = () => {
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  // state
  const title = useRef(null);
  const description = useRef(null);
  const estimatedTime = useRef(null);
  const materialsNeeded = useRef(null);
  const [errors, setErrors] = useState([]);

  // event handlers
  const handleSubmit = async (event) => {
    event.preventDefault();

    const course = {
      title: title.current.value,
      description: description.current.value,
      estimatedTime: estimatedTime.current.value,
      materialsNeeded: materialsNeeded.current.value,
      userId: authUser.id,
    };

    const encodedCredentials = btoa(
      `${authUser.emailAddress}:${authUser.password}`
    );

    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(course),
    };

    // Send POST request
    try {
      if (authUser) {
        const response = await fetch(
          "http://localhost:5000/api/courses",
          fetchOptions
        );
        console.log(response);
        if (response.status === 201) {
          console.log(`${course.title} was successfully created!`);
          navigate("/");
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

  return (
    <div className="wrap">
      <h2>Create Course</h2>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        <div className="main--flex">
          <div>
            <label htmlFor="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              ref={title}
            />
            <p>
              By {authUser.firstName} {authUser.lastName}
            </p>
            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              ref={description}
            />
          </div>
          <div>
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              ref={estimatedTime}
            />
            <label htmlFor="materialsNeeded">Materials Needed</label>
            <textarea
              id="materialsNeeded"
              name="materialsNeeded"
              ref={materialsNeeded}
            />
          </div>
        </div>
        <button className="button" type="submit">
          Create Course
        </button>
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
