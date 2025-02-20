import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import SensorModal from "../components/SensorModal";

export default function Project() {
  const navigate = useNavigate();
  let params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState("");
  const [sensors, setSensors] = useState("");

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

  return (
    <div className="container mx-auto xl:px-14 py-2 text-gray-500 mb-10">
      <div className=" flex justify-between mt-10 max-w-screen-xl flex-wrap items-center mx-auto">
        {project && (
          <div>
            <h1 className="text-7xl">{project.title}</h1>
            {sensors.map((index) => (
              <div key={index.id}>
                {index.name}
              </div>
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
              Add sensors
            </button>
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
