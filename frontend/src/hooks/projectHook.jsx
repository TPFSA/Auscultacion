import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

const API_URL = import.meta.env.VITE_BASE_URL;

export const useProject = (id) => {
  const [project, setProject] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiRequest(
          `${API_URL}project/${id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error al usar Token Auth:", error.message);
      }
    };

    if (id) fetchProject()
  }, [id]);

  return { project, setProject };
};
