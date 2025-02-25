import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import logo from "../assets/TPF_Logo_Blue.png";
import { FaUserAlt, FaDoorOpen, FaBars, FaCaretDown } from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuthStatus } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    checkAuthStatus();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    checkAuthStatus();
    navigate("/login");
    setShowLogoutConfirmation(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-100 shadow">
      <div className="container mx-auto px-4 flex justify-between items-center h-24">
        <Link to="https://tpfingenieria.com/es" className="flex items-center">
          <img src={logo} className="h-auto" width={150} alt="TPF Logo" />
        </Link>

        {/* Menú principal */}
        <div className="hidden xl:flex space-x-8">
          <NavLink to="/" linkName="Home" />
          {isAuthenticated && <NavLink to="/projects" linkName="Projects" />}
          {isAuthenticated && <NavLink to="/excelform" linkName="Form" />}
        </div>

        {/* Botón de usuario */}
        <div className="hidden xl:flex items-center ">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-500 gap-2 px-3 py-2 rounded-md hover:text-sky-600"
              >
                <FaUserAlt /> {user?.username || "Usuario"} <FaCaretDown />
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2"
                >
                  {user?.email && (
                    <p className="px-4 py-2 text-gray-600">{user?.email}</p>
                  )}
                  <NavLink
                    linkName="Log Out"
                    onClick={() => setShowLogoutConfirmation(true)}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  />
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-sky-600 text-white px-4 py-2 rounded-lg"
            >
              Log In
            </Link>
          )}
        </div>

        {/* Botón menú móvil */}
        <div className="xl:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-500 focus:outline-none"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="xl:hidden bg-white shadow-md absolute top-24 left-0 w-full z-50">
          <div className="flex flex-col p-4">
            <NavLink
              to="/"
              linkName="Home"
              onClick={() => setMenuOpen(false)}
            />
            {isAuthenticated && (
              <div className="flex flex-col">
                <NavLink
                  to="/projects"
                  linkName="Projects"
                  onClick={() => setMenuOpen(false)}
                />
                <NavLink
                  to="/"
                  linkName="Dashboard"
                  onClick={() => setMenuOpen(false)}
                />
                <NavLink
                  linkName="Log Out"
                  onClick={() => {
                    setShowLogoutConfirmation(true), setMenuOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de confirmación de logout */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-10 flex justify-center items-center">
          <div className="bg-white p-10 rounded-md flex flex-col gap-2 items-center">
            <p className="text-gray-500 text-7xl">
              <FaDoorOpen />
            </p>
            <p className="text-gray-500 font-bold">
              ¿Estás seguro que quieres cerrar sesión?
            </p>
            <div className="flex justify-around gap-5 mt-4">
              <button
                onClick={handleLogout}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, linkName, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-4 py-2 font-medium text-gray-500 hover:text-sky-600"
  >
    {linkName}
  </Link>
);

export default NavBar;
