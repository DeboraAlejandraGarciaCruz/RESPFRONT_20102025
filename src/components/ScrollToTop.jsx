import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll al top cuando la ruta cambia
    window.scrollTo(0, 0);
  }, [pathname]); // Se ejecuta cada vez que pathname cambia

  return null; // Este componente no renderiza nada visible
}

export default ScrollToTop;
