// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleCatalogClick = (e) => {
    if (location.pathname.includes('/producto/')) {
      e.preventDefault();
      setTimeout(() => {
        window.location.href = '/catalogo';
      }, 50);
    }
  };

  return (
    // CAMBIO CLAVE: Usamos 'navbar-halagos' y ajustamos el padding/estructura
    <nav className="navbar-halagos flex justify-between items-center">
      <Link to="/" className="logo">
        Halagos
      </Link>
      <div className="space-x-6 flex items-center">
        {' '}
        {/* Aumentamos el espacio y centramos los ítems */}
        <Link to="/catalogo" onClick={handleCatalogClick} className="main-link">
          Catálogo
        </Link>
        <Link to="/contacto" className="main-link">
          Contacto
        </Link>
        {user ? (
          <>
            <Link to="/admin" className="">
              Admin
            </Link>
            <button
              onClick={handleLogout}
              // CLASE ESPECÍFICA para el botón
              className="logout-button"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/admin" className="">
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
