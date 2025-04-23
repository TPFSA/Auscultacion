import L from 'leaflet';
import fissurometro from "../assets/fissurometro-icon.svg"
import extensometro from "../assets/extensometro-icon.svg"
import piezometro from "../assets/piezometro-icon.svg"

const iconFissurometro = new L.Icon({
    iconUrl: fissurometro,
    iconRetinaUrl: fissurometro,
    iconAnchor: new L.Point(30, 75), // Asegúrate de que el iconAnchor esté definido correctamente
  popupAnchor: new L.Point(0, -75),
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'custom-icon'
});
const iconExtensometro = new L.Icon({
    iconUrl: extensometro,
    iconRetinaUrl: extensometro,
    iconAnchor: new L.Point(30, 75), // Asegúrate de que el iconAnchor esté definido correctamente
  popupAnchor: new L.Point(0, -75),
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'custom-icon'
});
const iconPiezometro = new L.Icon({
    iconUrl: piezometro,
    iconRetinaUrl: piezometro,
    iconAnchor: new L.Point(30, 75), // Asegúrate de que el iconAnchor esté definido correctamente
  popupAnchor: new L.Point(0, -75),
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'custom-icon'
});

export { iconPiezometro, iconExtensometro, iconFissurometro };