import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import SensorModal from "../components/SensorModal";
import { IoArrowBackCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Project() {
  const navigate = useNavigate();
  let params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState("");
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    getProject();
    getSensors();
  }, []);

  const getProject = async (e) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/project/${params.id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error al usar Token Auth:", error.message);
    }
  };
  const getSensors = async (e) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/sensor/?project_id=${params.id}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setSensors(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteProject = async (e) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/project/${params.id}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      console.log("Deleted sucessfuly");
      navigate("/projects");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };
  return (
    <div className="container mx-auto xl:px-14 py-2 text-gray-500 mb-10">
      <div className="max-w-screen-xl flex-wrap items-center mx-auto">
        <div className="flex items-center justify-between px-5 py-3 text-base">
          <div className="flex gap-2 items-center w-100">
            <GoHomeFill style={{ width: 15, height: 15, fill: "#d97706" }} />
            <Link to={"/"}>
              <h1 className="text-gray-500">Home</h1>
            </Link>
            <FaArrowRight style={{ width: 15, height: 15, fill: "#d97706" }} />
            <Link to={"#"}>
              <h1 className="font-medium text-amber-600">Proyecto</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3"></div>
            <button className="text-amber-600 text-3xl" onClick={handleGoBack}>
              <IoArrowBackCircle />
            </button>
          </div>
        </div>
      <div className="w-full border-b-2 border-gray-200"></div>

        {project && (
          <div className="px-4 max-w-screen-xl">
            <h1 className="text-7xl">{project.title}</h1>
            {sensors?.map((index) => (
              <div key={index.id}>{index.name}</div>
            ))}
            <button className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
              Add data
            </button>
            <button
              data-dialog-target="modal"
              onClick={() => {
                setIsOpen(true);
              }}
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            >
              Edit sensors
            </button>
            <Link
              to="/dashboard"
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            >
              Dashboard
              {/* Nueva pestaña para enseñar todos los graficos */}
            </Link>
            {isOpen && (
              <SensorModal
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false), getSensors();
                }}
              ></SensorModal>
            )}
            <button
              onClick={deleteProject}
              className="rounded-md bg-red-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            >
              Delete Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
