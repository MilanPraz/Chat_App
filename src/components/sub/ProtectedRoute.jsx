import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("token");
  // console.log(loggedIn);
  if (!loggedIn) {
    return <Navigate to={"/user/login"} />;
  }
  // console.log("asdasd");
  return children;
}

export default ProtectedRoute;
