import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { Link } from 'react-router-dom';
import './CatalogPage.css';

export default function CatalogPage() {
  const { products, fetchProducts } = useProducts();
  const { categories, fetchCategories } = useCategories();

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tappedCards, setTappedCards] = useState(new Set());

  const productsPerPage = 12;

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProducts(), fetchCategories()]);
        if (isMounted) setLoading(false);
      } catch (error) {
        console.error(error);
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [fetchProducts, fetchCategories]);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) =>
          p.categories?.some((cat) => cat.name === selectedCategory)
        );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const goToPage = (page) => setCurrentPage(page);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages)
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const handleTap = (productId) => {
    const newTappedCards = new Set(tappedCards);
    if (newTappedCards.has(productId)) {
      newTappedCards.delete(productId);
    } else {
      newTappedCards.add(productId);
    }
    setTappedCards(newTappedCards);
  };

  if (loading)
    return (
      <div className="catalog-main-container text-center">
        <h2 className="loading-text">Cargando productos...</h2>
      </div>
    );

  return (
    <>
      <div className="contact-header-bg py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
          CATÁLOGO DE PRODUCTOS
        </h1>
      </div>

      <div className="catalog-main-container">
        <div className="catalog-filters">
          <button
            className={`filter-button ${
              selectedCategory === 'all' ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`filter-button ${
                selectedCategory === cat.name ? 'active' : ''
              }`}
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentPage(1);
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {currentProducts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🛍️</span>
            <p className="empty-state-text">
              No hay productos en esta categoría.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {currentProducts.map((p) => {
              const mainImage =
                p.images?.[0] && p.images[0].startsWith('http')
                  ? p.images[0]
                  : p.image?.startsWith('http')
                  ? p.image
                  : `http://localhost:5000/${p.images?.[0] || p.image}`;

              const altImage =
                p.images?.[1] && p.images[1].startsWith('http')
                  ? p.images[1]
                  : p.images?.[1]
                  ? `http://localhost:5000/${p.images[1]}`
                  : null;

              return (
                <div
                  key={p._id}
                  className={`product-card ${
                    tappedCards.has(p._id) ? 'tapped' : ''
                  }`}
                  onClick={() => handleTap(p._id)}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={mainImage}
                      alt={p.name}
                      className="first-image transition-opacity duration-300"
                      onError={(e) => (e.target.src = '/placeholder.png')}
                      loading="lazy"
                    />
                    {altImage && (
                      <img
                        src={altImage}
                        alt={`${p.name} alterna`}
                        className="second-image transition-opacity duration-300"
                        onError={(e) => (e.target.src = '/placeholder.png')}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <h2 className="product-name">{p.name}</h2>
                  <p className="product-price">${p.price}</p>
                  <Link to={`/producto/${p._id}`} className="product-link">
                    Ver detalle
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Página {currentPage} de {totalPages} • {filteredProducts.length}{' '}
              productos
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <div className="pagination-numbers">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`page-number ${
                      currentPage === page ? 'active' : ''
                    }`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="pagination-button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
