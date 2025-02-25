import React, { useEffect, useRef, useState } from "react";

import { FaArrowRight } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { SiBim } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";

function Dashboard() {
  // Navegación para regresar a la página principal
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/");
  };

  // State hooks
  const [lotes, setLotes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState({
    sector: "",
    subSector: "",
    parte: "",
    elemento: "",
    lote: "",
    ppi: "",
  });
  const [uniqueValues, setUniqueValues] = useState({
    sector: [],
    subSector: [],
    parte: [],
    elemento: [],
    lote: [],
    ppi: [],
  });

  const [noAptosPorSector, setNoAptosPorSector] = useState({});
  const [totalNoAptos, setTotalNoAptos] = useState(0);
  const [sectorSeleccionado, setSectorSeleccionado] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (sector) => {
    setSectorSeleccionado(sector);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSectorSeleccionado("");
  };

  const timelineRef = useRef(null);
  const aptoNoAptoRef = useRef(null);
  const graficaLotesRef = useRef(null);

  return (
    <div className="container mx-auto xl:px-14 py-2 text-gray-500 mb-10">
      {/* Barra de navegación */}
      <div className="flex items-center justify-between px-5 py-3 text-base">
        <div className="flex gap-2 items-center w-100">
          <GoHomeFill style={{ width: 15, height: 15, fill: "#d97706" }} />
          <Link to={"/"}>
            <h1 className="text-gray-500">Home</h1>
          </Link>
          <FaArrowRight style={{ width: 15, height: 15, fill: "#d97706" }} />
          <Link to={"#"}>
            <h1 className="font-medium text-amber-600">Dashboard</h1>
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

      <div className="flex flex-col items-start justify-center mt-2 bg-white p-4 rounded-xl">
        <div className="flex justify-between w-full gap-4"></div>
        {/* Filtros para la vista de gráficos */}

        <div className="w-full">
          <div className="my-5 grid xl:grid-cols-4 grid-cols-1 gap-5"></div>

          {/* Gráficos y mapa */}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-4">
            <div className="xl:col-span-2" ref={timelineRef}></div>
            <div className="xl:col-span-1" ref={aptoNoAptoRef}></div>
            <div className="xl:col-span-1" ref={graficaLotesRef}></div>
          </div>
        </div>

        {/* Resumen por nivel */}

        {/* Modal de Resumen de Sector */}
      </div>
    </div>
  );
}

export default Dashboard;
