import { useEffect, useState, useCallback } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useColors } from '../../context/ColorContext';
import { apiFetch } from '../../utils/api';
import CategoryForm from './CategoryForm';
import ColorForm from './ColorForm';
import { FaTag, FaFileImage } from 'react-icons/fa';
import { IoCreate } from 'react-icons/io5';
import {
  MdDescription,
  MdOutlineAttachMoney,
  MdInvertColors,
  MdCategory,
} from 'react-icons/md';
import { GiClothes } from 'react-icons/gi';
import './ProductForm.css';

export default function ProductForm() {
  const { products, fetchProducts } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const { colors, fetchColors } = useColors();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: [],
    colors: [],
    categories: [],
    images: [],
    image: null,
  });

  const [preview, setPreview] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Cargar datos iniciales
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchColors();
  }, [fetchProducts, fetchCategories, fetchColors]);

  // Helpers de paginación
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const displayedProducts = [...currentProducts];
  const emptySlots = itemsPerPage - displayedProducts.length;
  for (let i = 0; i < emptySlots; i++) displayedProducts.push(null);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((i) => i !== value)
        : [...prev[type], value],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreview((prev) => [...prev, ...urls]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sizes: [],
      colors: [],
      categories: [],
      images: [],
      image: null,
    });
    setPreview([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);

      formData.sizes.forEach((s) => formDataToSend.append('sizes', s));
      formData.colors.forEach((c) => formDataToSend.append('colors', c));
      formData.categories.forEach((cat) =>
        formDataToSend.append('categories', cat)
      );

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => formDataToSend.append('images', img));
      }

      let response;
      if (editingId) {
        // Editar producto existente
        response = await apiFetch(`/api/products/${editingId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        // Crear producto nuevo
        response = await apiFetch('/api/products', {
          method: 'POST',
          body: formDataToSend,
        });
      }

      await fetchProducts();
      resetForm();
      alert('✅ Producto guardado correctamente');
    } catch (error) {
      console.error('❌ Error al crear o actualizar producto:', error);
      alert('❌ Error al guardar producto. Revisa consola.');
    }
  };

  const handleEdit = (product) => {
    // Rellenar el formulario con los datos existentes
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      sizes: product.sizes || [],
      colors: (product.colors || []).map((c) => (c._id ? c._id : c)),
      categories: (product.categories || []).map((cat) =>
        cat._id ? cat._id : cat
      ),
      images: [], // Se vacía para que el usuario pueda subir nuevas si quiere
    });

    // Mostrar las imágenes actuales como vista previa
    if (Array.isArray(product.images) && product.images.length > 0) {
      setPreview(product.images);
    } else if (product.image) {
      // Compatibilidad con productos que solo tienen un campo 'image'
      setPreview([product.image]);
    } else {
      setPreview([]);
    }

    // Guardar el ID del producto que se está editando
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      await fetchProducts();
      if (currentProducts.length === 1 && currentPage > 1)
        setCurrentPage(currentPage - 1);
    } catch (err) {
      console.error('Error eliminando producto:', err);
    }
  };

  const goToPage = (page) => setCurrentPage(page);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages)
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="product-form-container">
      <div className="product-form-grid">
        {/* FORM */}
        <div className="form-card">
          <h2 className="form-title">
            <IoCreate
              style={{
                marginRight: '5px',
                verticalAlign: 'middle',
                color: '#f38ca4',
              }}
            />
            {editingId ? 'Editar Producto' : 'Crear Producto'}
          </h2>

          <form onSubmit={handleSubmit} className="product-form">
            {/* Nombre */}
            <div className="form-group">
              <label className="form-label">
                <FaTag style={{ marginRight: '8px', color: '#f38ca4' }} />
                Nombre del Producto
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingresa el nombre del producto"
                className="form-input"
                required
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label">
                <MdDescription
                  style={{ marginRight: '5px', color: '#f38ca4' }}
                />
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe el producto..."
                className="form-textarea"
                required
              />
            </div>

            {/* Precio */}
            <div className="form-group">
              <label className="form-label">
                <MdOutlineAttachMoney
                  style={{ marginRight: '5px', color: '#f38ca4' }}
                />
                Precio ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="form-input"
                required
              />
            </div>

            {/* Tallas */}
            <div className="form-group">
              <label className="form-label">
                <GiClothes style={{ marginRight: '5px', color: '#f38ca4' }} />
                Tallas disponibles
              </label>
              <div className="checkbox-group">
                {['S', 'M', 'G', 'XG'].map((size) => (
                  <label key={size} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={size}
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleCheckboxChange('sizes', size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="form-group">
              <label className="form-label">
                <MdInvertColors
                  style={{ marginRight: '5px', color: '#f38ca4' }}
                />
                Colores
              </label>
              <div className="checkbox-group">
                {colors.map((color) => (
                  <label key={color._id} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={color._id}
                      checked={formData.colors.includes(color._id)}
                      onChange={() => handleCheckboxChange('colors', color._id)}
                    />
                    {color.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Categorías */}
            <div className="form-group">
              <label className="form-label">
                <MdCategory style={{ marginRight: '5px', color: '#f38ca4' }} />
                Categorías
              </label>
              <div className="checkbox-group">
                {categories.map((cat) => (
                  <label key={cat._id} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={cat._id}
                      checked={formData.categories.includes(cat._id)}
                      onChange={() =>
                        handleCheckboxChange('categories', cat._id)
                      }
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div className="form-group">
              <label className="form-label">
                <FaFileImage style={{ marginRight: '5px', color: '#f38ca4' }} />
                Imágenes del producto
              </label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {preview.length > 0 && (
                <div className="image-preview-container">
                  <p className="form-label">Vista previa:</p>
                  <div className="image-preview-grid">
                    {preview.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Vista ${index + 1}`}
                        className="image-preview"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="submit-button">
              <IoCreate style={{ color: '#ffffff' }} />{' '}
              {editingId ? ' Actualizar ' : ' Crear Producto '}
            </button>
          </form>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="list-card">
          <h3 className="list-title">
            📦 Productos Existentes
            <span className="products-count">
              {totalProducts} producto{totalProducts !== 1 ? 's' : ''}
            </span>
          </h3>

          <div className="products-list">
            {displayedProducts.map((product, index) =>
              product ? (
                <div key={product._id} className="product-item">
                  <div className="product-content">
                    {(product.images?.length > 0 || product.image) && (
                      <div className="product-image-container">
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          className="product-image-list primary"
                        />
                        {product.images && product.images[1] && (
                          <img
                            src={product.images[1]}
                            alt={`${product.name} alterna`}
                            className="product-image-list secondary"
                          />
                        )}
                      </div>
                    )}

                    <div className="product-info">
                      <h4 className="product-name">{product.name}</h4>
                      <div className="product-details">
                        <p>
                          <strong>Precio:</strong> ${product.price}
                        </p>
                        <p>
                          <strong>Colores:</strong>{' '}
                          {(product.colors || [])
                            .map((c) => c.name || c)
                            .join(', ') || 'N/A'}
                        </p>
                        <p>
                          <strong>Categorías:</strong>{' '}
                          {(product.categories || [])
                            .map((cat) => cat.name || cat)
                            .join(', ') || 'N/A'}
                        </p>
                        <p>
                          <strong>Tallas:</strong>{' '}
                          {(product.sizes || []).join(', ') || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="product-actions">
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="delete-button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={`empty-${index}`}
                  className="product-item"
                  style={{ opacity: 0, pointerEvents: 'none' }}
                >
                  <div className="product-content">
                    <div
                      className="product-image"
                      style={{ visibility: 'hidden' }}
                    ></div>
                  </div>
                </div>
              )
            )}
            {totalProducts === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <div className="empty-state-text">No hay productos</div>
                <div className="empty-state-subtext">
                  Crea tu primer producto usando el formulario
                </div>
              </div>
            )}
          </div>

          {totalProducts > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Página {currentPage} de {totalPages} • {totalProducts} productos
              </div>
              <div className="pagination-controls">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  ← Anterior
                </button>
                <div className="pagination-numbers">
                  {getPageNumbers().map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`page-number ${
                        currentPage === p ? 'active' : ''
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="management-forms">
        <CategoryForm />
        <ColorForm />
      </div>
    </div>
  );
}
