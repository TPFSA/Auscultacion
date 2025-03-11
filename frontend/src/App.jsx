import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./components/AuthContext";
import { ProjectProvider } from "./context/projectContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="text-gray-500 flex h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/excelform" element={<Form />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              <Route
                path="/dashboard"
                element={
                  <ProjectProvider>
                    <Dashboard />
                  </ProjectProvider>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProjectProvider>
                    <Projects />
                  </ProjectProvider>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProjectProvider>
                    <Project />
                  </ProjectProvider>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
