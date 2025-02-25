// src/services/apiClient.js
import { getAccessToken, refreshAccessToken, removeTokens } from "./authService";

export const apiRequest = async (url, options = {}) => {
  let accessToken = getAccessToken();
  if (!accessToken) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      removeTokens();
      window.location.href = "/login"; // Redirigir al login si no se puede renovar el token
      return;
    }
  }

  // Agregar encabezados
  const headers = options.body instanceof FormData
    ? {} // Si es FormData, no agregamos 'Content-Type' (el navegador lo maneja)
    : { "Content-Type": "application/json","Authorization" : `Bearer ${accessToken}`,  ...options.headers }
    ;

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.warn("Token expirado, intentando refrescar...");
      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken) {
        removeTokens();
        window.location.href = "/login"; // Redirigir si falla el refresh
        return;
      }

      headers.Authorization = `Bearer ${newAccessToken}`;
      return fetch(url, { ...options, headers });
    }

    return response;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
