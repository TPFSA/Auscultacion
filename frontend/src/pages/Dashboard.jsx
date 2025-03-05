import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMapEvents } from 'react-leaflet/hooks'
import L from "leaflet";
import { IoArrowBackCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { apiRequest } from "../services/apiClient";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  let params = useParams();
  const mapRef = useRef(null);
  const [project, setProject] = useState("");
  const [sensors, setSensors] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const calculo = [
    { lectura: 1, diferencia: `` },
    { lectura: 2, diferencia: "" },
    { lectura: 3, diferencia: "" },
  ];

  useEffect(() => {
    getProject();
    getSensors();
  }, []);

  useEffect(() => {
    if (sensors.length > 0) {
      const newMarkers = sensors.map((sensor) => ({
        id: sensor.id,
        name: sensor.name,
        position: JSON.parse(sensor.coord),
      }));
      setMarkers([...newMarkers]);
    }
  }, [sensors]);
  const primeraLectura = calculo[0].lectura;

  // Calcular la diferencia para cada elemento
  const resultado = calculo.map((item) => ({
    ...item,
    diferencia: item.lectura - primeraLectura,
  }));

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
      const response = await apiRequest(
        `http://127.0.0.1:8000/project/${params.id}`,
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
  const getSensors = async (e) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/sensor/?project_id=${params.id}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setSensors(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-2  text-gray-500 mb-10">
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
          <Link to={"/projects"}>
            <h1 className="font-medium text-amber-600">{project.title}</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3"></div>
          <button className="text-amber-600 text-3xl" onClick={handleGoBack}>
            <IoArrowBackCircle />
          </button>
        </div>
      </div>
      <div className="w-full border-b-2 border-gray-200"></div>

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
            {markers.map((marker) => (
              <Marker key={marker.id} position={marker.position}>
                <Popup>
                  <div>Marker ID: {marker.id}</div>
                  <div>Name: {marker.name}</div>
                </Popup>
              </Marker>
            ))}
            <MapWithBounds />
            <LocationFinderDummy/>
          </MapContainer>
        </div>
        <div className="bg-amber-400 ml-2 p-4 w-full">
          <h1 className="justify-center text-4xl flex mb-6 mt-6">
            Sensors list
          </h1>
          <div>
            {visibleMarkers.map((index) => (
              <div
                key={index.id}
                className="rounded bg-amber-200 mb-1 p-2 font-medium"
              >
                {index.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-red-100 mt-3 h-30 flex justify-center content-center flex-wrap text-7xl">
        Sensores sin coordenadas
      </div>
      <div className="mt-3">
        <button className="inline-flex mr-2 h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 transition active:scale-110">
          Añadir datos
        </button>
        <button className="inline-flex h-12 items-center justify-center rounded-md bg-red-950 px-6 font-medium text-neutral-50 transition active:scale-110">
          Borrar proyecto
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
