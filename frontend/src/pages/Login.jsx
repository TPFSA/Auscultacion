import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar los tokens en localStorage
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir al usuario a la página principal
        window.location.href = "/";
      } else {
        setError(data.detail || "Error en el inicio de sesión");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor");
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 rounded-lg mt-6 h-fit shadow-[1px_2px_5px_3px_#00000024]">
      <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <form onSubmit={handleLogIn}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Iniciar sesión
        </button>
        <p className="mt-2">No estas registrado? Registrate <a href="/signup" className="bg-blue-200 rounded p-1">aqui!</a></p>
      </form>
    </div>
  );
}

export default Login;
