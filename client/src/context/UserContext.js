import { createContext, useState } from "react";
import Cookies from "js-cookie";

// initialize new context
const UserContext = createContext(null);

export const UserProvider = (props) => {
  // use cookie to preserve user's state
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  // Handle sign in
  const signIn = async (credentials) => {
    // use btoa method to encode user credentials
    const encodedCredentials = btoa(
      `${credentials.emailAddress}:${credentials.password}`
    );

    // Pass credentials into authorization header using basic authentication scheme
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };

    // Send GET request to get user's info
    const response = await fetch(
      "http://localhost:5000/api/users",
      fetchOptions
    );
    // If user is successfully authenticated
    if (response.status === 200) {
      // store user's info
      const user = await response.json();
      user.password = credentials.password;
      // Set authorized user as the current user
      setAuthUser(user);
      Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
      return user;
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  };

  // Handle sign out
  const signOut = () => {
    // clear user's data
    setAuthUser(null);
    Cookies.remove("authenticatedUser");
  };

  return (
    <UserContext.Provider
      value={{
        authUser,
        actions: {
          signIn,
          signOut,
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
