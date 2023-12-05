import React, { useState, useEffect } from "react";

function App() {
  const [courses, setCourses] = useState([]);
  const apiUrl = "http://localhost:5000/api/courses/";

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateCourseList = () => {
    return (
      <div id="courseListContainer">
        <div id="courseList">
          <ul>
            {courses.map((course) => (
              <li key={course.id}>{course.title}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Course List</h1>
      {generateCourseList()}
    </div>
  );
}

export default App;
