import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, fetchProducts } = useProducts();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const found = products.find((p) => p._id === id);
    setProduct(found);
  }, [id, products]);

  if (!product) return <p className="loading">Cargando producto...</p>;

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const related = products
    .filter(
      (p) =>
        p._id !== product._id &&
        p.categories?.some((c) =>
          product.categories?.some((cat) => cat.name === c.name)
        )
    )
    .slice(0, 4);

  return (
    <div className="product-detail-container">
      <div className="product-main">
        <div className="product-carousel">
          {product.images?.length > 0 && (
            <>
              <button className="arrow left" onClick={prevImage}>
                ‹
              </button>
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="main-photo"
              />
              <button className="arrow right" onClick={nextImage}>
                ›
              </button>
            </>
          )}
          <div className="thumbs">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i}`}
                className={i === currentImage ? 'thumb active' : 'thumb'}
                onClick={() => setCurrentImage(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>

          <p className="price">${product.price}</p>

          <p>
            <strong>Colores:</strong>{' '}
            {product.colors?.map((c) => c.name).join(', ') ||
              'No especificados'}
          </p>
          <p>
            <strong>Categorías:</strong>{' '}
            {product.categories?.map((c) => c.name).join(', ')}
          </p>

          <Link to="/contacto" className="btn-primary">
            Contáctanos
          </Link>

          <button className="btn-outline">Añadir a Favoritos</button>
        </div>
      </div>

      <div className="related-section">
        <h2>Productos Relacionados</h2>
        <div className="related-grid">
          {related.map((p) => (
            <div key={p._id} className="related-card">
              <Link to={`/producto/${p._id}`}>
                <img src={p.images?.[0]} alt={p.name} />
                <div className="info">
                  <h3>{p.name}</h3>
                  <p>${p.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
