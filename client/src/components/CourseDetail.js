import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import UserContext from "../context/UserContext";

const CourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { authUser } = useContext(UserContext);

  // state
  const [course, setCourse] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course");
        navigate("/error");
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // event handlers
  const handleDelete = async (event) => {
    event.preventDefault();

    const encodedCredentials = btoa(
      `${authUser.emailAddress}:${authUser.password}`
    );

    const fetchOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        fetchOptions
      );
      if (response.status === 204) {
        console.log(`${course.title} was successfully deleted!`);
        navigate("/");
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 400) {
        navigate("/error");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  if (course) {
    return (
      <>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === course.userId ? (
              <>
                <a className="button" href={`${course.id}/update`}>
                  Update Course
                </a>
                <a
                  className="button"
                  href={`${course.id}`}
                  onClick={handleDelete}
                >
                  Delete Course
                </a>
              </>
            ) : null}
            <a className="button button-secondary" href="/">
              Return to List
            </a>
          </div>
        </div>
        <div className="wrap">
          <h2>Course Detail</h2>
          <form>
            <div className="main--flex">
              <div>
                <h3 className="course--detail--title">Course</h3>
                <h4 className="course--name">{course.title}</h4>
                {course.User && (
                  <p>
                    By {course.User.firstName} {course.User.lastName}
                  </p>
                )}
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>
              <div>
                <h3 className="course--detail--title">Estimated Time</h3>
                <p>{course.estimatedTime}</p>
                <h3 className="course--detail--title">Materials Needed</h3>
                <ul className="course--detail--list">
                  <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
  navigate("/notfound");
};

export default CourseDetail;
