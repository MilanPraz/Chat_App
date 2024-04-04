import { Navigate } from "react-router-dom";

function ProtectedForm({ children }) {
  const loggedIn = localStorage.getItem("token");
  // console.log(loggedIn);
  if (
    loggedIn &&
    ["/user/signup", "/user/login"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }
  // console.log("asdasd");
  return children;
}

export default ProtectedForm;
