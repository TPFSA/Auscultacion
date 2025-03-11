import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { IoArrowBackCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { useData } from "../hooks/dataHook";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [resultData, setResultData] = useState("")
  const { sensorsData } = useData();
  
  const handleGoBack = () => {
    navigate("/");
  };
  const sensorGroups = sensorsData.reduce((acc, item) => {
    const sensorId = item.sensor; // ID del sensor
    if (!acc[sensorId]) acc[sensorId] = []; // Si no existe el array, lo creamos
    acc[sensorId].push({
      date: item.date,
      valDiferencia: parseFloat(item.valDiferencia) // Convertimos a número
    });
    
    return acc;
  }, {});

console.log(sensorsData);

  return (
    <div className="container mx-auto px-4 py-2  text-gray-500 mb-10">
      <div className="bg-sky-200 mt-10 w-300 p-5 rounded-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={sensorGroups}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="F1"
              stroke="#B8336A"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="F2"
              stroke="#C490D1"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="F3"
              stroke="#ACACDE"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="F4"
              stroke="#ABDAFC"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
