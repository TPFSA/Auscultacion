// src/services/authService.js
export const API_URL = `http://127.0.0.1:8000/auth/`;

export const getAccessToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refresh");

export const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("token", accessToken);
  if (refreshToken) localStorage.setItem("refresh", refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.error("No hay refresh token disponible.");
    removeTokens();
    return null;
  }

  try {
    const response = await fetch(`${API_URL}token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      console.error("No se pudo refrescar el token.");
      removeTokens();
      return null;
    }

    const data = await response.json();
    saveTokens(data.access, data.refresh);
    return data.access;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    removeTokens();
    return null;
  }
};
