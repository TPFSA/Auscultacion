import React, { useState } from "react";
import { apiRequest } from "../services/apiClient";
import { useParams } from "react-router-dom";

export default function SensorModal({ isEditSensorOpen, onClose }) {
  if (!isEditSensorOpen) return null; // No renderizar si no está abierto

  const [sensor, setSensor] = useState("");
  const [type, setType] = useState("");
  const [coordx, setCoordx] = useState("");
  const [coordy, setCoordy] = useState("");
  const [valInicial, setValInicial] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  let params = useParams();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (fileType === "xls" || fileType === "xlsx") {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Solo se permiten archivos Excel (.xls, .xlsx)");
      }
    }
  };

  const handleSubmit = async (e) => {
    const coords =
      coordx == "" || coordy == "" ? null : `[${coordx}, ${coordy}]`;
    e.preventDefault();
    try {
      const sensorResponse = await apiRequest("http://127.0.0.1:8000/sensor/", {
        method: "POST",
        body: JSON.stringify({
          name: sensor,
          valInicial: valInicial,
          coord: coords,
          type: type,
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

  const addExcelData = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Por favor, seleccione un archivo Excel.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await apiRequest("http://127.0.0.1:8000/form/upload/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al subir el archivo");
      }
  
      for (const key of Object.keys(data.data)) {
        try {
          const sensorResponse = await apiRequest(
            "http://127.0.0.1:8000/sensor/",
            {
              method: "POST",
              body: JSON.stringify({
                name: key,
                valInicial: data.data[key][0].valInicial,
                type: "Termometer",
                project: `${params.id}`,
              }),
            }
          );
  
          if (!sensorResponse.ok) {
            throw new Error(`Error HTTP: ${sensorResponse.status}`);
          }
  
          const sensor = await sensorResponse.json();
  
          for (const entry of data.data[key]) {
            try {
              const dataResponse = await apiRequest(
                "http://127.0.0.1:8000/sensor_data_piezometro/",
                {
                  method: "POST",
                  body: JSON.stringify({
                    sensor: sensor.id,
                    valActual: entry.lectura,
                    date: entry.data,
                  }),
                }
              );
              if (!dataResponse.ok) {
                throw new Error(`Error HTTP: ${dataResponse.status}`);
              }
            } catch (error) {
              console.error("Error al enviar datos del sensor:", error.message);
            }
          }
        } catch (error) {
          console.error("Error al crear sensor:", error.message);
        }
      }
  
      onClose(); // Se ejecuta solo después de completar todo el proceso
  
    } catch (error) {
      setError(`Hubo un problema al subir el archivo: ${error.message}`);
    }
  };
  

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-gray-600/50">
      <div className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="bg-white text-gray-500  mb-4">
          <div className="grid sm:grid-cols-1 grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Nombre del sensor
              </label>
              <select id="sensor-name" name="sensor-name" onChange={(e) => setSensor(e.target.value)}>
                <option value="Termometer">Termometer</option>
                <option value="Extensometro">Extensometro</option>
                <option value="Piezometro">Piezometro</option>
              </select>
              <label className="block text-sm font-medium text-gray-800">
                ValInicial
              </label>
              <input
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                type="number"
                placeholder="ValInicial"
                value={valInicial}
                onChange={(e) => setValInicial(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-800">
                Sensor coord
              </label>
              <input
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                type="number"
                placeholder="Nombre coord"
                value={coordx}
                onChange={(e) => setCoordx(e.target.value)}
              />
              <input
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                type="number"
                placeholder="Nombre coord"
                value={coordy}
                onChange={(e) => setCoordy(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-800">
                Tipo
              </label>
              <select id="types" name="types" onChange={(e) => setType(e.target.value)}>
                <option value="Termometer">Termometer</option>
                <option value="Extensometro">Extensometro</option>
                <option value="Piezometro">Piezometro</option>
              </select>
            </div>
            <div className="flex">
              <div className="w-full border-b-2 border-gray-200"></div>O
              <div className="w-full border-b-2 border-gray-200"></div>
            </div>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500"
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="btn font-semibold" onClick={addExcelData}>
              Subir archivo
            </button>

            <div className="flex">
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
          </div>
        </form>
      </div>
    </div>
  );
}
