import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

const API_URL = import.meta.env.VITE_BASE_URL;

export const useData = (ids) => {
  const [sensorsData, setSensorsData] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiRequest(`${API_URL}sensor_data/filter/`, {
          method: "POST",
          body: JSON.stringify({
            ids: ids,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setSensorsData(data);
      } catch (error) {
        console.error("Error al usar Token Auth:", error.message);
      }
    };
    console.log(sensorsData)
    if (ids) fetchProject();
  }, [ids]);

  return { sensorsData };
};
