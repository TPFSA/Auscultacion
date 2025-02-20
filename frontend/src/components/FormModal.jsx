import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

export default function FormModal({ isOpen, onClose }) {
  if (!isOpen) return null; // No renderizar si no está abierto
  const [title, setTitle] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [sensor, setSensor] = useState("");
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  useEffect(()=>{
    setCreationDate(getDate())
  }, [])

  function getDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const date = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest("http://127.0.0.1:8000/project/", {
        method: "POST",
        body: JSON.stringify({
          title,
          creation_date: creationDate,
          user: JSON.parse(storedUser).id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      const sensorResponse = await apiRequest("http://127.0.0.1:8000/sensor/", {
        method: "POST",
        body: JSON.stringify({
          name: sensor,
          type: "Termometer",
          project: data.id,
        }),
      });
      if (!sensorResponse.ok) {
        throw new Error(`Error HTTP: ${sensorResponse.status}`);
      }
      onClose();
    } catch (error) {
      console.error("Error al usar Token Auth:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-gray-600/50">
      <div className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="bg-white text-gray-500  mb-4">
          <div className="grid sm:grid-cols-1 grid-cols-1 gap-4">
            <div className="">
              <label className="block text-sm font-medium text-gray-800">
                Project name
              </label>
              <input
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                type="text"
                placeholder="Título del proyecto"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Fecha y hora
              </label>
              <input
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                type="date"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
              Sensor name
              </label>
    
            <input
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
              type="text"
              placeholder="Nombre sensor"
              value={sensor}
              onChange={(e) => setSensor(e.target.value)}
            />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition"
            >
              Add project
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
