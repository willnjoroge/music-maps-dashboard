import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";

const App = () => {
  console.log("testing");
  return (
    <div className="App">
      <h1>Spotify Music Dashboard</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

const Login = () => {
  console.log("login");
  return (
    <div>
      <h1>Music Maps Dashboard</h1>
      <a href="http://localhost:5000/login">
        <button disabled>Login with Spotify</button>
      </a>
    </div>
  );
};

export default App;
