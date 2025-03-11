import React, { useState } from "react";
import { apiRequest } from "../services/apiClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Form = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [keys, setKeys] = useState([]);
  const [resultData, setResultData] = useState(null); // Nuevo estado para almacenar los datos recibidos

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

  const handleSubmit = async (event) => {
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

      setKeys(Object.keys(data.data));
      const firstKey = keys[0];
      
      Object.keys(data.data).forEach(key => {
        data.data[key].forEach(key => {
          console.log(key);
          
        })
      })
      console.log(Object.keys(data.data));
      console.log(keys);
      const mergedData = data.data.F1.map((item, index) => ({
        date: item.data, // Eje X (Fechas)
        [Object.keys(data.data)[0]]: parseFloat(item.diferencia), // Diferencia de F1
        F2: parseFloat(data.data.F2[index]?.diferencia || "0"), // Diferencia de F3 (Si existe)
        F3: parseFloat(data.data.F3[index]?.diferencia || "0"), // Diferencia de F3 (Sis existe)
        F4: parseFloat(data.data.F4[index]?.diferencia || "0"), // Diferencia de F3 (Si existe)
      }));

      setResultData(mergedData);
      console.log(mergedData);
      // Guardar los datos en el estado
      setFile(null);
    } catch (error) {
      setError(`Hubo un problema al subir el archivo ${error}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-sky-200 rounded-md">
        <h2 className="text-2xl bg-sky-400 p-5 rounded-t-md">
          Subir archivo Excel
        </h2>
        <div className="p-5 flex justify-between">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="bg-indigo-600 hover:not-focus:bg-indigo-700 px-4 py-2 rounded-full text-sm font-semibold text-indigo-100"
          >
            Subir
          </button>
        </div>
      </form>

      {/* Mostrar solo la propiedad "Suma" de cada elemento */}
      {resultData && (
        <div className="bg-sky-200 mt-10 w-300 p-5 rounded-md">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={resultData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="F1"
                stroke="#B8336A"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="F2"
                stroke="#C490D1"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="F3"
                stroke="#ACACDE"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="F4"
                stroke="#ABDAFC"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
export default Form;
