import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMapEvents } from "react-leaflet/hooks";
import { apiRequest } from "../services/apiClient";


export default function SensorLocationModal({ isEditCoordOpen, onClose, id }) {
  if (!isEditCoordOpen) return null;

  const [coordx, setCoordx] = useState("");
  const [coordy, setCoordy] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sensorCoordResponse = await apiRequest(
        `http://127.0.0.1:8000/sensor-coord/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify({
            coord: `[${coordx}, ${coordy}]`,
          }),
        }
      );
      if (!sensorCoordResponse.ok) {
        throw new Error(`Error HTTP: ${sensorCoordResponse.status}`);
      }
      onClose();
    } catch (error) {
      console.error("Error al usar Token Auth:", error.message);
    }
  };
  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(e) {
        setCoordx(e.latlng.lat)
        setCoordy(e.latlng.lng)
      },
    });
    return null;
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-gray-600/50">
      <div className="relative m-4 p-4 w-3/5 min-w-[80%] min-h-[80%] rounded-lg bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="bg-white text-gray-500 h-full mb-4">
          <div className="grid h-full sm:grid-cols-1 grid-cols-1 gap-4">
            <div className="h-full">
              <label className="block text-sm font-medium text-gray-800">
                Sensor coord
              </label>
              <div className="flex h-100">
                <div className="h-full w-full">
                  <MapContainer
                    center={[41.515212, 2.149378]}
                    zoom={20}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationFinderDummy />
                  </MapContainer>
                </div>
                <div className="h-full w-full">
                  <input
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                    type="number"
                    placeholder="Nombre coord"
                    value={coordx}
                    onChange={(e) => setCoordx(e.target.value)}
                  />
                  <input
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                    type="number"
                    placeholder="Nombre coord"
                    value={coordy}
                    onChange={(e) => setCoordy(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition"
            >
              Add coordinates
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
