import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { apiRequest } from "../services/apiClient";
import SensorModal from "../components/SensorModal";
import SensorLocationModal from "../components/SensorLocationModal";
import DataModal from "../components/AddDataModel";
import { useProjectData } from "../context/projectContext";
import { iconFissurometro, iconExtensometro, iconPiezometro } from "../components/Icon";

export default function Project() {
  let { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const { project, fetchProject, sensors, fetchSensorData, fetchSensors } =
    useProjectData();

  const [markers, setMarkers] = useState([]);
  const [filter, setFilter] = useState(null);
  const [sensorId, setSensorId] = useState(null);
  const [visibleMarkers, setVisibleMarkers] = useState([]);

  const [isEditSensorOpen, setIsEditSensorOpen] = useState(false);
  const [isEditCoordOpen, setIsEditCoordOpen] = useState(false);
  const [isAddDataOpen, setIsAddDataOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sensors.length > 0) {
      console.log(sensors)
      const newMarkers = sensors
        .filter((sensor) => sensor.coord != null)
        .map((sensor) => ({
          id: sensor.id,
          name: sensor.name,
          position: JSON.parse(sensor.coord),
          type: sensor.type,
          valInicial: JSON.parse(sensor.valInicial),
        }));
      setMarkers([...newMarkers]);
    } else {
      setMarkers([]);
    }
  }, [sensors]);

  useEffect(() => {
    fetchProject(id).then(() => setLoading(false));
  }, []);

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
    }, [map, sensors]);

    return null;
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
    fetchSensorData(selectedIds);
    navigate("/dashboard");
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

  const finishProject = async (e) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/project-finish/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify({
            finished: true,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.data}`);
      }
      const data = await response.json();
      navigate("/projects");
    } catch (error) {
      console.log(error);
    }
  };

  const iconMap = {
    Termometer: iconFissurometro,
    Extensometro: iconExtensometro,
    Piezometro: iconPiezometro,
  }

  return (
    <div className="container mx-auto px-4 py-2 text-gray-500 mb-10">
      <div className="max-w-screen-xl flex-wrap h-full items-center mx-auto">
        {loading ? (
          <div>Loading</div>
        ) : (
          project && (
            <div className="px-4 max-w-screen-xl h-full">
              {/*Navegacion para todas las pestañas*/}
              <div className="flex items-center justify-between px-5 py-3 text-base">
                <div className="flex gap-2 items-center w-100">
                  <GoHomeFill
                    style={{ width: 15, height: 15, fill: "#d97706" }}
                    />
                  <Link to={"/"}>
                    <h1 className="text-gray-500">Home</h1>
                  </Link>
                  <FaArrowRight
                    style={{ width: 15, height: 15, fill: "#d97706" }}
                    />
                  <Link to={"/projects"}>
                    <h1 className="font-medium text-amber-600">Proyectos</h1>
                  </Link>
                  <FaArrowRight
                    style={{ width: 15, height: 15, fill: "#d97706" }}
                    />
                  <Link to={"#"}>
                    <h1 className="font-medium text-amber-600">{project.title}</h1>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-3"></div>
                  <button
                    className="text-amber-600 text-3xl"
                    onClick={handleGoBack}
                    >
                    <IoArrowBackCircle />
                  </button>
                </div>
              </div>
              {/*Separador gris*/}
              <div className="w-full border-b-2 border-gray-200"></div>

              <div className="px-4 max-w-screen-xl h-full">
                <h1 className="text-7xl">{project.title}</h1>
                <div className="flex gap-2 justify-center p-3">
                  <button className="btn bg-sky-700" onClick={()=>{filter != "Termometer" ? setFilter("Termometer") : setFilter(null)}}>Solo Azules</button>
                  <button className="btn bg-green-500" onClick={()=>{filter != "Extensometro" ? setFilter("Extensometro") : setFilter(null)}}>Solo Verdes</button>
                  <button className="btn bg-red-400" onClick={()=>{filter != "Piezometro" ? setFilter("Piezometro") : setFilter(null)}}>Solo Rojos</button>
                </div>
                {/*Mapa con lista*/}
                <div className="w-full h-1/2 flex mt-4">
                  <div className="h-full w-full rounded-md">
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
                        const icon = iconMap[marker.type]
                        return (
                          <Marker key={marker.id} position={marker.position} icon={icon}>
                            <Popup>
                              <div>Marker ID: {marker.id}</div>
                              <div>Name: {marker.name}</div>
                              <div>Val inicial: {marker.valInicial}</div>
                              <div>Tipo: {marker.type}</div>
                            </Popup>
                          </Marker>
                        );
                      })}
                      <MapWithBounds />
                    </MapContainer>
                  </div>
                  <div className="bg-gray-200 ml-2 p-4 w-full overflow-y-auto">
                    { filter &&
                    <h1 className="justify-center text-4xl flex mb-6 mt-6">
                      {filter}
                    </h1>
                    }
                    <div className="flex flex-col">
                      {visibleMarkers
                      .filter((index) => index.type == filter)
                      .map((index) => (
                        <button
                          id={index.id}
                          key={index.id}
                          onClick={(e) => {
                            e.target.classList.toggle("selected");
                          }}
                          className="rounded bg-gray-300 hover:bg-gray-400 mb-1 p-2 font-medium"
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
                      setIsEditCoordOpen(false);
                      fetchSensors(project.id);
                    }}
                  ></SensorLocationModal>
                )}
                {/*Todos los botones agrupados*/}
                <div className="gap-2 flex mt-3">
                  <button
                    className="btn"
                    onClick={() => {
                      setIsAddDataOpen(true);
                      console.log(sensorsData);
                    }}
                  >
                    Add data
                  </button>
                  {/*Modal para añadir data a los sensores (fecha y valActual) */}
                  {isAddDataOpen && (
                    <DataModal
                      isAddDataOpen={isAddDataOpen}
                      onClose={() => {
                        setIsAddDataOpen(false);
                      }}
                    ></DataModal>
                  )}
                  <button
                    data-dialog-target="modal"
                    onClick={() => {
                      setIsEditSensorOpen(true);
                    }}
                    className="btn-default btn"
                  >
                    Edit sensors
                  </button>
                  {/*Modal para añadir sensores*/}
                  {isEditSensorOpen && (
                    <SensorModal
                      isEditSensorOpen={isEditSensorOpen}
                      onClose={() => {
                        setIsEditSensorOpen(false);
                        fetchSensors(project.id);
                      }}
                    ></SensorModal>
                  )}
                  <Link
                    // to={`/dashboard/${project.id}`}
                    className="btn"
                    onClick={handleDashboard}
                  >
                    Dashboard
                    {/* Nueva pestaña para enseñar todos los graficos */}
                  </Link>
                  <Link
                    onClick={deleteProject}
                    className="btn bg-red-800 hover:bg-red-900 ml-auto"
                  >
                    Delete Project
                  </Link>
                  {!project.finished && (
                    <Link
                      onClick={finishProject}
                      className="btn bg-red-800 hover:bg-red-900"
                    >
                      Terminar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
