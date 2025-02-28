import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const Dashboard = () => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([
    { id: 1, position: [41.515212, 2.149378] },
    { id: 2, position: [41.516212, 2.148378] },
    { id: 3, position: [41.517212, 2.150378] },
  ]);
  const calculo = [
    { lectura: 1, diferencia: `` },
    { lectura: 2, diferencia: "" },
    { lectura: 3, diferencia: "" },
  ];

  const primeraLectura = calculo[0].lectura;

  // Calcular la diferencia para cada elemento
  const resultado = calculo.map((item) => ({
    ...item,
    diferencia: item.lectura - primeraLectura,
  }));
  console.log(resultado);
  const [visibleMarkers, setVisibleMarkers] = useState([]);

  function MapWithBounds() {
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
        console.log("Marcadores visibles:", visibleMarkers);
      };

      map.on("moveend", handleMove);

      return () => {
        map.off("moveend", handleMove);
      };
    }, [map]);

    return null;
  }

  return (
    <div className="w-full flex">
      <div className="w-1/2 h-full">
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
              <Popup>Marker ID: {marker.id}</Popup>
            </Marker>
          ))}
          <MapWithBounds />
        </MapContainer>
      </div>
      <div>
        {visibleMarkers.map((index) => (
          <div>{index.id}</div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
