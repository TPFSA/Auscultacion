import React, { useState } from "react";

const Form = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
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
      const response = await fetch("http://127.0.0.1:8000/form/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al subir el archivo");
      }

      setResultData(data.data); // Guardar los datos en el estado
      setFile(null);
    } catch (error) {
      setError(`Hubo un problema al subir el archivo ${error}`);
    }
  };

  return (
    <div >
      <form onSubmit={handleSubmit} className="bg-sky-200 rounded-md">
        <h2 className="text-2xl bg-sky-400 p-5 rounded-t-md">Subir archivo Excel</h2>
        <div className="p-5">
            <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500" />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" className="bg-indigo-600 hover:not-focus:bg-indigo-700 px-4 py-2 rounded-full text-sm font-semibold text-indigo-100">Subir</button>
        </div>
      </form>

      {/* Mostrar solo la propiedad "Suma" de cada elemento */}
      {resultData && (
        <div className="bg-sky-200 mt-10 p-5 rounded-md">
          <h3>Resultados:</h3>
          {resultData.map((item, index) => (
            <p key={index}>Suma: {item.result}</p>
          ))}
        </div>
      )}
    </div>
  );
};
export default Form;
