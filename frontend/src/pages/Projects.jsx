import React, { useEffect, useState } from "react";
import FormModal from "../components/FormModal";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiClient";

export default function Projects() {
  const [project, setProjects] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getAllProjects();
  }, []);

  const getAllProjects = async (e) => {
    if (e) e.preventDefault();

    try {
      const response = await apiRequest("http://127.0.0.1:8000/project/", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error al usar Token Auth:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2 text-gray-500 mb-10">
      <div className="flex justify-between mt-10 flex-wrap items-center mx-auto">
        <h1 className="text-5xl p-4 rounded-md">Projects</h1>
        <button
          data-dialog-target="modal"
          onClick={() => {
            setIsOpen(true);
          }}
          className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
        >
          Add project
        </button>
      </div>
      {isOpen && (
        <FormModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false), getAllProjects();
          }}
        ></FormModal>
      )}
      {project && (
        <div className="grid grid-cols-4 grid-rows-5 gap-4 mt-10 flex-wrap items-center mx-auto">
          {project.map((index) => (
            <Link to={`/projects/${index.id}`} key={index.id} className="bg-gray-300 flex flex-col p-4 rounded-xl hover:bg-gray-400">
              <div>{index.title}</div>
              <div>{index.creation_date}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
