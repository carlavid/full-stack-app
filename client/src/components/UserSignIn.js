import { useContext, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import ErrorsDisplay from "./ErrorsDisplay";
import UserContext from "../context/UserContext";

const UserSignIn = () => {
  // get access to signIn function
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const emailAddress = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);

  // Event handlers
  const handleSubmit = async (event) => {
    event.preventDefault();
    let from = "/";
    if (location.state) {
      from = location.state.from;
    }

    // Store user credentials
    const credentials = {
      emailAddress: emailAddress.current.value,
      password: password.current.value,
    };

    // Sign in user using their credentials
    try {
      const user = await actions.signIn(credentials);
      // if user exists, navigate to previous route
      if (user) {
        navigate(from);
        // if user doesn't exist, update error state
      } else {
        setErrors(["Sign-in was unsuccesful"]);
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
    <div className="form--centered">
      <h2>Sign In</h2>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          ref={emailAddress}
        />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" ref={password} />
        <button className="button" type="submit">
          Sign In
        </button>
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
      <p>
        Don't have a user account? Click here to{" "}
        <Link to="/signup">sign up</Link>!
      </p>
    </div>
  );
};

export default UserSignIn;
