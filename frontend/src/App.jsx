import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homee from "./pages/Home";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="text-gray-500 flex h-full">
          <Routes>
            <Route path="/" element={<Homee />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<Project />} />
          </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
