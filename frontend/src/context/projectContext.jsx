import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../services/apiClient";

const API_URL = import.meta.env.VITE_BASE_URL;

const ProjectContext = createContext();

export const useProjectData = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(null); // Datos del proyecto actual
  const [sensors, setSensors] = useState([]); // Sensores asociados al proyecto
  const [sensorsData, setSensorsData] = useState([]); // Datos de los sensores

  const fetchProject = async (projectId) => {
    try {
      const response = await apiRequest(`${API_URL}project/${projectId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProject(data);
      await fetchSensors(data.id);
    } catch (error) {
      console.error("Error en el proyecto:", error.message);
    }
  };

  const fetchSensors = async (projectId) => {
    try {
      const response = await apiRequest(
        `${API_URL}sensor/?project_id=${projectId}`,
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
      console.error("Error en el fetch sensores:", error.message);
    }
  };

  const fetchSensorData = async (sensorsArray) => {
    try {
      const response = await apiRequest(`${API_URL}sensor_data/filter/`, {
        method: "POST",
        body: JSON.stringify({
          ids: sensorsArray,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log(`sensor data : ${data}` );
      
      setSensorsData(data);
    } catch (error) {
      console.error("Error en el fetch de sensor Data:", error.message);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        fetchProject,
        sensors,
        sensorsData,
        fetchSensorData,
        fetchSensors,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
