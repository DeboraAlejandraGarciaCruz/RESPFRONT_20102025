import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useMetrics } from '../context/MetricsContext';
import { useCategories } from '../context/CategoryContext';
import './HomePage.css';

// Función auxiliar para manejar imágenes de Cloudinary y locales
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/assets/product-placeholder.jpg';

  // Si ya es una URL completa (por ejemplo Cloudinary)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Si es una ruta relativa guardada en backend
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    return `${import.meta.env.VITE_API_URL || ''}/${imagePath.replace(
      /^\//,
      ''
    )}`;
  }

  // Si es una imagen en assets locales
  return `/assets/${imagePath}`;
};

export default function HomePage() {
  const { products, fetchProducts } = useProducts();
  const { productViews, totalViews } = useMetrics();
  const { categories } = useCategories();

  const [showCategories, setShowCategories] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();

  // Cargar productos destacados cuando haya productos disponibles
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    } else {
      const destacados = [...products]
        .sort((a, b) => (productViews[b.id] || 0) - (productViews[a.id] || 0))
        .slice(0, 4);
      setTopProducts(destacados);
    }
  }, [products, productViews, fetchProducts]);

  return (
    <div className="home-page">
      {/* Hero / Banner */}
      <section className="home-hero">
        <div className="home-hero-content">
          <br></br>
          <br></br>
          <p></p>
          <p>
            Ropa íntima que inspira confianza, estilo y sensualidad. Diseñada
            para resaltar tu belleza y comodidad todos los días.
          </p>
          <button className="home-btn" onClick={() => navigate('/catalogo')}>
            Ver Catálogo
          </button>
        </div>
      </section>

      {/* Métricas */}
      <section className="metrics-section">
        <div className="metric-card">
          <h3>{products.length}</h3>
          <p>Productos disponibles</p>
        </div>
        <div className="metric-card">
          <h3>{totalViews || 0}</h3>
          <p>Vistas totales del sitio</p>
        </div>
        <div
          className="metric-card metric-clickable"
          onClick={() => setShowCategories(!showCategories)}
        >
          <h3>{categories.length}</h3>
          <p>Categorías</p>
          {showCategories && (
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat.id}>{cat.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="metric-card">
          <h3>100%</h3>
          <p>Calidad garantizada</p>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="featured-products">
        <h2>Productos Destacados</h2>
        <div className="products-grid">
          {topProducts.map((product) => {
            const imageSrc =
              product.images?.length > 0
                ? getImageUrl(product.images[0])
                : getImageUrl(product.image);

            return (
              <div key={product.id} className="product-card">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="featured-product-image"
                  onError={(e) => {
                    e.target.src = '/assets/product-placeholder.jpg';
                  }}
                />

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <span className="product-price">${product.price}</span>
                </div>
              </div>
            );
          })}
          {topProducts.length === 0 && (
            <p className="no-products">No hay productos destacados aún.</p>
          )}
        </div>
      </section>

      {/* Banner intermedio */}
      <section className="mid-banner"></section>

      {/* Misión, Por qué elegirnos y Contacto */}
      <section className="about-section">
        <div className="about-grid">
          <div>
            <h1>Nuestra Misión</h1>
            <p>
              Nos dedicamos a crear ropa interior de la más alta calidad a
              precios competitivos que acompañen a las mujeres desde lo más
              íntimo, combinando comodidad, estilo y sensualidad. Transmitimos
              mensajes positivos que promueven el amor propio, el bienestar
              diario y una conexión auténtica con lo que significa realmente la
              belleza propia.
            </p>
            <p>
              Nuestro compromiso es con la satisfacción del cliente y la
              excelencia en el servicio.
            </p>

            <h1>Por Qué Elegirnos</h1>
            <ul>
              <li>✨ Productos de alta calidad garantizada y diseño suave.</li>
              <li>💸 Precios competitivos en el mercado.</li>
              <li>🤝 Atención al cliente personalizada.</li>
              <li>
                🎁 Presentación cuidada del producto (etiquetas y empaques).
              </li>
              <li>👩‍🦰 Una marca pensada para todas, sin ninguna exclusión.</li>
            </ul>
          </div>

          <div>
            <h1>Contacto</h1>
            <ul>
              <li>📞 Teléfono: (761) 688 1492</li>
              <li>📧 Email: halagosunderweare@gmail.com</li>
              <li>📍 Dirección: Parque Industrial, Jilotepec, Edo. Mex</li>
              <li>🕑 Horarios: Lun-Jue 7:00 - 16:30</li>
              <li>🕑 Horarios: Viernes 7:00 - 16:00</li>
            </ul>
            <p>💌 ¡Contáctanos, estaremos felices de atenderte!</p>
            <Link to="/contacto" className="home-btn">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
