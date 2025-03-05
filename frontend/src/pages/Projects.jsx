import React, { useEffect, useState } from "react";
import FormModal from "../components/FormModal";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiClient";
import { IoArrowBackCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";

export default function Projects() {
  const [projects, setProjects] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    getAllFilteredProjects();
  }, []);

  const getAllFilteredProjects = async (e) => {
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

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-2 text-gray-500 mb-10">
      <div className="max-w-screen-xl flex-wrap items-center mx-auto">
        <div className="flex items-center justify-between px-5 py-3 text-base">
          <div className="flex gap-2 items-center w-100">
            <GoHomeFill style={{ width: 15, height: 15, fill: "#d97706" }} />
            <Link to={"/"}>
              <h1 className="text-gray-500">Home</h1>
            </Link>
            <FaArrowRight style={{ width: 15, height: 15, fill: "#d97706" }} />
            <Link to={"/projects"}>
              <h1 className="font-medium text-amber-600">Proyectos</h1>
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
              setIsOpen(false), getAllFilteredProjects();
            }}
          ></FormModal>
        )}
        {projects && (
          <div>
            <div className="flex justify-center">
              <button className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" onClick={()=>{setIsFinished(false)}}>
                Pendientes
              </button>
              <button className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" onClick={()=>{setIsFinished(true)}}>
                Terminados
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-10 flex-wrap items-center mx-auto">
              {projects.map(function (index) {
                if (index.finished == isFinished) {
                  return (
                    <Link
                      to={`/projects/${index.id}`}
                      key={index.id}
                      className="bg-gray-300 flex flex-col p-4 rounded-xl hover:bg-gray-400"
                    >
                      <div>{index.title}</div>
                      <div>{index.creation_date}</div>
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
