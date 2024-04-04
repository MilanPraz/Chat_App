import { useEffect, useState } from "react";

import "./App.css";
import Signup from "./components/main/Signup";
import Login from "./components/main/Login";
import Dashboard from "./components/main/Dashboard";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/sub/ProtectedRoute";
import ProtectedForm from "./components/sub/ProtectedForm";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "./redux/userSlice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.user.value);
  // console.log(userinfo);
  let token = localStorage.getItem("token");
  // console.log(token);
  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:8009/api/singleuser`, {
          headers: {
            authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
          dispatch(setUserDetail(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* protecting route login coz logged in vaisakyo vane wuslai login rw signup ma jana dinu vayena redirect garnu paryo home mai */}
        <Route
          path="/user/signup"
          element={
            <ProtectedForm>
              <Signup />
            </ProtectedForm>
          }
        />
        <Route
          path="/user/login"
          element={
            <ProtectedForm>
              <Login />
            </ProtectedForm>
          }
        />
      </Routes>
    </>
  );
}

export default App;
