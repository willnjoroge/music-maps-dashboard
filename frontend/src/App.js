import "./App.css";
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";
// import { AuthContext } from "./context/AuthContext";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        {/* <Route
          path="/dashboard"
          render={() => (token === "" ? <Dashboard /> : <Navigate to="/" />)}
        /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
