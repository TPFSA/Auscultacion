import { apiRequest } from "./apiClient";

const API_URL = import.meta.env.VITE_BASE_URL + "project/";

export const fetchProject = async (id) => {
  try {
    const response = await apiRequest(`${API_URL}${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener el proyecto:", error.message);
    return null;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await apiRequest(API_URL, {
      method: "POST",
      body: JSON.stringify(projectData),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear el proyecto:", error.message);
    return null;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await apiRequest(`${API_URL}${id}/`, {
      method: "PUT",
      body: JSON.stringify(projectData),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error.message);
    return null;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await apiRequest(`${API_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    console.log("Proyecto eliminado exitosamente");
    return true;
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error.message);
    return false;
  }
};
