import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { IoArrowBackCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { useData } from "../hooks/dataHook";
import { useProjectData } from "../context/projectContext";
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

const Dashboard = () => {
  const [resultData, setResultData] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  // const { sensorsData } = useData();

  const { sensorsData, project } = useProjectData();

  const handleGoBack = () => {
    navigate("/");
  };

  const sensorGroups = sensorsData.reduce((acc, item) => {
    const sensorName = item.sensor_name; // ID del sensor
    const date = new Date(item.date); // Convertimos a objeto Date

    if (!acc[sensorName]) acc[sensorName] = []; // Si no existe el array, lo creamos
    acc[sensorName].push({
      date: date.getTime(), // Usamos getTime() para convertir la fecha a milisegundos
      valDiferencia: parseFloat(item.valDiferencia), // Convertimos a número
    });

    // Actualizamos la fecha máxima y mínima
    if (maxDate == null || date > new Date(maxDate)) {
      setMaxDate(date);
    }
    if (minDate == null || date < new Date(minDate)) {
      setMinDate(date);
    }

    return acc;
  }, {});

  const sensorKeys = Object.keys(sensorGroups);

  const getColorFromIndex = (index) => `hsl(${(index * 137) % 360}, 70%, 50%)`;

  return (
    <div className="container mx-auto px-4 py-2 text-gray-500 mb-10">
      <div className="flex items-center justify-between px-5 py-3 text-base">
        <div className="flex gap-2 items-center w-100">
          <GoHomeFill style={{ width: 15, height: 15, fill: "#d97706" }} />
          <Link to={"/"}>
            <h1 className="text-gray-500">Home</h1>
          </Link>
          <FaArrowRight style={{ width: 15, height: 15, fill: "#d97706" }} />
          <Link to={"/projects"}>
            <h1 className="font-medium text-amber-600">Proyectos</h1>
          </Link>
          <FaArrowRight style={{ width: 15, height: 15, fill: "#d97706" }} />
          <Link to={`/projects/${project.id}`}>
            <h1 className="font-medium text-amber-600">Proyecto</h1>
          </Link>
          <FaArrowRight style={{ width: 15, height: 15, fill: "#d97706" }} />
          <Link to={"#"}>
            <h1 className="font-medium text-amber-600">Dashboard</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3"></div>
          <Link className="text-amber-600 text-3xl" to={`/projects/${project.id}`}>
            <IoArrowBackCircle />
          </Link>
        </div>
      </div>
      {/* Separador gris */}
      <div className="w-full border-b-2 border-gray-200"></div>
      <div className="bg-sky-200 mt-10 w-300 p-5 rounded-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={sensorGroups[sensorKeys[0]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="number" // Usa "number" para trabajar con fechas en milisegundos
              domain={[minDate, maxDate]} // Ajustamos el dominio con las fechas mínimas y máximas
              tickFormatter={(tick) => {
                const date = new Date(tick);
                return `${date.getMonth() + 1}/${date.getFullYear()}`;
              }} // Formateamos la fecha para mostrar mes/año
            />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Dibujar una línea por cada sensor */}
            {sensorKeys.map((sensorId, index) => (
              <Line
                key={sensorId}
                type="monotone"
                data={sensorGroups[sensorId]}
                dataKey="valDiferencia"
                name={`${sensorId}`}
                stroke={getColorFromIndex(index)} // Alterna colores
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
