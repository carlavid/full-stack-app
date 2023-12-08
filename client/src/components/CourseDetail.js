import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", course);
      }
    };
    fetchCourse();
  }, [course, id]);

  if (course) {
    return (
      <>
        <div className="actions--bar">
          <div className="wrap">
            <a className="button" href={`${course.id}/update`}>
              Update Course
            </a>
            <a className="button" href="/">
              Delete Course
            </a>
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
                <p>
                  <ReactMarkdown>{course.description}</ReactMarkdown>
                </p>
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
  return null;
};

export default CourseDetail;
