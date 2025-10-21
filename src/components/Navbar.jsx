// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <nav className="bg-halagos-navbar shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-halagos-dark">
        Mi Tienda
      </Link>
      <div className="space-x-4">
        <Link
          to="/catalogo"
          onClick={handleCatalogClick}
          className="text-halagos-dark hover:text-halagos-gray"
        >
          Catálogo
        </Link>
        <Link
          to="/contacto"
          className="text-halagos-dark hover:text-halagos-gray"
        >
          Contacto
        </Link>

        {user ? (
          <>
            <Link
              to="/admin"
              className="text-halagos-dark hover:text-halagos-gray"
            >
              Admin
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link
            to="/admin"
            className="text-halagos-dark hover:text-halagos-gray"
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
