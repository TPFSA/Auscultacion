import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

const API_URL = import.meta.env.VITE_BASE_URL

export const useSensors = (projectId, refresh) => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const fetchSensors = async () => {
      console.log("asd");
      
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
        console.log(error);
      }
    };
    if (projectId) fetchSensors()
  }, [projectId, refresh]);
  return { sensors };
};
