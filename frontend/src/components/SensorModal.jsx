import React, { useState } from "react";
import { apiRequest } from "../services/apiClient";
import { useParams } from "react-router-dom";

export default function SensorModal({ isOpen, onClose }) {
  if (!isOpen) return null; // No renderizar si no está abierto

  const [sensor, setSensor] = useState("");

  let params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const sensorResponse = await apiRequest("http://127.0.0.1:8000/sensor/", {
        method: "POST",
        body: JSON.stringify({
          name: sensor,
          type: "Termometer",
          project: `${params.id}`,
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
              Add sensor
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
