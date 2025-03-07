import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/apiClient";

export default function DataModal({ isAddDataOpen, onClose}) {
  if (!isAddDataOpen) return null; // No renderizar si no está abierto
  let params = useParams();

  const [date, setDate] = useState("");
  const [valActual, setValActual] = useState("");
  const [selectedSensor, setSelectedSensor] = useState("");
  const [sensors, setSensors] = useState("");

  useEffect(() => {
    setDate(getDate());
    getSensors();
  }, []);

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
      const dataResponse = await apiRequest(
        "http://127.0.0.1:8000/sensor_data_dist/",
        {
          method: "POST",
          body: JSON.stringify({
            sensor: selectedSensor,
            valActual: valActual,
            date: date,
          }),
        }
      );
      if (!dataResponse.ok) {
        throw new Error(`Error HTTP: ${dataResponse.status}`);
      }
      onClose();
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
      console.log(data)
      setSensors(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-gray-600/50">
      <div className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="bg-white text-gray-500  mb-4">
            {!selectedSensor && sensors && (
                <div>
                    {sensors.map((index)=> (
                    <div key={index.id} id={index.id} onClick={()=>setSelectedSensor(index.id)}>{index.name}</div>
                ))}
                </div>
            )}
          {selectedSensor && (
            <div className="grid sm:grid-cols-1 grid-cols-1 gap-4">
                <button onClick={()=> setSelectedSensor("")}> bakc</button>
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  ValActual
                </label>
                <input
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                  type="number"
                  placeholder="ValActual"
                  value={valActual}
                  onChange={(e) => setValActual(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Fecha y hora
                  </label>
                  <input
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition"
              >
                Add data
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
