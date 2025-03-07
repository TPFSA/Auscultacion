import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMapEvents } from "react-leaflet/hooks";
import L from "leaflet";
import { apiRequest } from "../services/apiClient";
import SensorModal from "../components/SensorModal";
import SensorLocationModal from "../components/SensorLocationModal";
import DataModal from "../components/AddDataModel";
import { useSensors } from "../services/sensorHook";

export default function Project() {
  let { id } = useParams();
  const mapRef = useRef(null);
  const [project, setProject] = useState("");
  // const [sensors, setSensors] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [sensorId, setSensorId] = useState(null);
  const [refresh, setRefresh] = useState(null);

  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const navigate = useNavigate();
  const [isEditSensorOpen, setIsEditSensorOpen] = useState(false);
  const [isEditCoordOpen, setIsEditCoordOpen] = useState(false);
  const [isAddDataOpen, setIsAddDataOpen] = useState(false);

  const { sensors } = useSensors(id, refresh);

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    if (sensors.length > 0) {
      const newMarkers = sensors
        .filter((sensor) => sensor.coord != null)
        .map((sensor) => ({
          id: sensor.id,
          name: sensor.name,
          position: JSON.parse(sensor.coord),
        }));
      setMarkers([...newMarkers]);
    }
  }, [sensors]);

  const MapWithBounds = () => {
    const map = useMap();

    useEffect(() => {
      if (!mapRef.current) {
        mapRef.current = map;
      }

      const handleMove = () => {
        const bounds = map.getBounds();
        const visibleMarkers = markers.filter((marker) =>
          bounds.contains(L.latLng(marker.position))
        );
        setVisibleMarkers(visibleMarkers);
      };

      map.on("moveend", handleMove);

      return () => {
        map.off("moveend", handleMove);
      };
    }, [map]);

    return null;
  };

  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(e) {
        console.log(e.latlng);
      },
    });
    return null;
  };
  const getProject = async (e) => {
    try {
      const response = await apiRequest(`http://127.0.0.1:8000/project/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error al usar Token Auth:", error.message);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleDashboard = (e) => {
    if (e) e.preventDefault();

    // Seleccionamos todos los botones con la clase "selected"
    const selectedSensors = document.querySelectorAll(".selected");

    // Convertimos el NodeList en un array y extraemos los IDs
    const selectedIds = [...selectedSensors].map((sensor) => sensor.id);
    console.log(markers);

    console.log(selectedIds); // Array con los IDs seleccionados
  };

  const deleteProject = async (e) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/project/${id}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      console.log("Deleted sucessfuly");
      navigate("/projects");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2 text-gray-500 mb-10">
      <div className="max-w-screen-xl flex-wrap h-full items-center mx-auto">
        {/*Navegacion para todas las pestañas*/}
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
            <Link to={"#"}>
              <h1 className="font-medium text-amber-600">Proyecto</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3"></div>
            <button className="text-amber-600 text-3xl" onClick={handleGoBack}>
              <IoArrowBackCircle />
            </button>
          </div>
        </div>
        {/*Separador gris*/}
        <div className="w-full border-b-2 border-gray-200"></div>

        {project && (
          <div className="px-4 max-w-screen-xl h-full">
            <h1 className="text-7xl">{project.title}</h1>
            {/*Mapa con lista*/}
            <div className="w-full h-1/2 flex mt-4">
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
                  {markers.map(function (marker) {
                    return (
                      <Marker key={marker.id} position={marker.position}>
                        <Popup>
                          <div>Marker ID: {marker.id}</div>
                          <div>Name: {marker.name}</div>
                          <div>Val inicial: {marker.valInicial}</div>
                        </Popup>
                      </Marker>
                    );
                  })}
                  <MapWithBounds />
                  <LocationFinderDummy />
                </MapContainer>
              </div>
              <div className="bg-amber-400 ml-2 p-4 w-full">
                <h1 className="justify-center text-4xl flex mb-6 mt-6">
                  Sensors list
                </h1>
                <div className="flex flex-col">
                  {visibleMarkers.map((index) => (
                    <button
                      id={index.id}
                      key={index.id}
                      onClick={(e) => {
                        e.target.classList.toggle("selected");
                      }}
                      className="rounded bg-amber-200 hover:bg-amber-700 mb-1 p-2 font-medium"
                    >
                      {index.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/*Sensores sin coordenadas*/}
            {sensors
              .filter((sensor) => sensor.coord == null) // Filtra solo los sensores con coord == null
              .map((sensor) => (
                <div
                  key={sensor.id}
                  className="bg-red-100 mt-3 flex content-center flex-wrap p-2 gap-2"
                >
                  <button
                    data-dialog-target="modal"
                    onClick={() => {
                      setSensorId(sensor.id);
                      setIsEditCoordOpen(true);
                    }}
                    className="hover:bg-red-700 rounded bg-red-200 p-2 font-medium w-1/3 "
                  >
                    {sensor.name}
                  </button>
                </div>
              ))}
            {/*Modal para editar coordenadas*/}
            {isEditCoordOpen && (
              <SensorLocationModal
                isEditCoordOpen={isEditCoordOpen}
                id={sensorId}
                onClose={() => {
                  setIsEditCoordOpen(false); setRefresh((prev) => !prev);
                }}
              ></SensorLocationModal>
            )}
            {/*Todos los botones agrupados*/}
            <div>
              <button
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                onClick={() => {
                  setIsAddDataOpen(true);
                }}
              >
                Add data
              </button>
              {/*Modal para añadir data a los sensores (fecha y valActual) */}
              {isAddDataOpen && (
                <DataModal
                  isAddDataOpen={isAddDataOpen}
                  onClose={() => {
                    setIsAddDataOpen(false); setRefresh((prev) => !prev)
                  }}
                ></DataModal>
              )}
              <button
                data-dialog-target="modal"
                onClick={() => {
                  setIsEditSensorOpen(true);
                }}
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              >
                Edit sensors
              </button>
              {/*Modal para añadir sensores*/}
              {isEditSensorOpen && (
                <SensorModal
                  isEditSensorOpen={isEditSensorOpen}
                  onClose={() => {
                    setIsEditSensorOpen(false); setRefresh((prev) => !prev)
                  }}
                ></SensorModal>
              )}
              <Link
                // to={`/dashboard/${project.id}`}
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                onClick={handleDashboard}
              >
                Dashboard
                {/* Nueva pestaña para enseñar todos los graficos */}
              </Link>
              <button
                onClick={deleteProject}
                className="rounded-md bg-red-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              >
                Delete Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
