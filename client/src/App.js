import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Courses from "./components/Courses";
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import CourseDetail from "./components/CourseDetail";
import UserSignUp from "./components/UserSignUp";
import UserSignIn from "./components/UserSignIn";
import UserSignOut from "./components/UserSignOut";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import Forbidden from "./components/Forbidden";
import UnhandledError from "./components/UnhandledError";

function App() {
  return (
    <div id="root">
      <Header />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/signout" element={<UserSignOut />} />
        <Route element={<PrivateRoute />}>
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/update" element={<UpdateCourse />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/error" element={<UnhandledError />} />
      </Routes>
    </div>
  );
}

export default App;
