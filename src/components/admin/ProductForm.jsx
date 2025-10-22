import { useEffect, useState, useCallback } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useColors } from '../../context/ColorContext';
import { apiFetch } from '../../utils/api';
import CategoryForm from './CategoryForm';
import ColorForm from './ColorForm';
import { FaTag, FaFileImage, FaTrash } from 'react-icons/fa';
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
    existingImages: [],
  });

  const [preview, setPreview] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // 🔹 Lista de imágenes marcadas para eliminar
  const [deletedImages, setDeletedImages] = useState([]);

  // Helper para manejar URLs Cloudinary o locales
  const getImageUrl = (img) =>
    img?.startsWith('http') ? img : `http://localhost:5000/${img}`;

  // ============================ CARGA INICIAL ============================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchColors();
  }, [fetchProducts, fetchCategories, fetchColors]);

  // ============================ PAGINACIÓN ============================
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const displayedProducts = [...currentProducts];
  const emptySlots = itemsPerPage - displayedProducts.length;
  for (let i = 0; i < emptySlots; i++) displayedProducts.push(null);

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

  // ============================ HANDLERS ============================
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

  // ============================ IMÁGENES ============================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemovePreview = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 🔹 NUEVO: marcar imágenes existentes para eliminar (sin llamar DELETE)
  const handleRemoveExistingImage = (imageUrl) => {
    if (!editingId)
      return alert('Solo puedes borrar imágenes existentes en modo edición.');
    const confirmDelete = window.confirm(
      '¿Seguro que deseas eliminar esta imagen?'
    );
    if (!confirmDelete) return;

    // Quitarla de la vista
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img !== imageUrl),
    }));

    // Guardar para enviarla al backend en el próximo PUT
    setDeletedImages((prev) => [...prev, imageUrl]);
  };

  // ============================ FORMULARIO ============================
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sizes: [],
      colors: [],
      categories: [],
      images: [],
      existingImages: [],
    });
    setPreview([]);
    setEditingId(null);
    setDeletedImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('description', formData.description);
      dataToSend.append('price', formData.price);

      formData.sizes.forEach((s) => dataToSend.append('sizes', s));
      formData.colors.forEach((c) => dataToSend.append('colors', c));
      formData.categories.forEach((cat) =>
        dataToSend.append('categories', cat)
      );

      // 🧩 Agregar imágenes nuevas
      if (formData.images.length > 0) {
        formData.images.forEach((img) => dataToSend.append('images', img));
      }

      // 🧩 Agregar imágenes eliminadas
      if (deletedImages.length > 0) {
        const publicIds = deletedImages.map((url) => {
          const parts = url.split('/');
          const publicId = parts.slice(-2).join('/').split('.')[0];
          return publicId;
        });
        dataToSend.append('deletedImages', JSON.stringify(publicIds));
      }

      // 🧩 Crear o actualizar producto
      if (editingId) {
        await apiFetch(`/api/products/${editingId}`, {
          method: 'PUT',
          body: dataToSend,
        });
      } else {
        await apiFetch('/api/products', { method: 'POST', body: dataToSend });
      }

      await fetchProducts();
      resetForm();
      alert('✅ Producto guardado correctamente');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('❌ Error al guardar producto. Revisa consola.');
    }
  };

  // ============================ EDITAR Y ELIMINAR ============================
  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      sizes: product.sizes || [],
      colors: (product.colors || []).map((c) => (c._id ? c._id : c)),
      categories: (product.categories || []).map((cat) =>
        cat._id ? cat._id : cat
      ),
      images: [],
      existingImages: product.images || [],
    });
    setPreview([]);
    setEditingId(product._id);
    setDeletedImages([]); // limpiar borradas al editar
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

  // ============================ RENDER ============================
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
                Subir imágenes (máx. 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-input-file"
              />
            </div>

            {/* BOTÓN */}
            <button type="submit" className="submit-button">
              {editingId ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </form>

          {/* ==================== PREVIEW NUEVAS IMÁGENES ==================== */}
          {preview.length > 0 && (
            <div className="image-preview-container">
              <p className="form-label">Nuevas imágenes:</p>
              <div className="image-preview-grid">
                {preview.map((src, index) => (
                  <div key={index} className="image-preview-wrapper">
                    <img
                      src={src}
                      alt={`Vista ${index + 1}`}
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="delete-preview-btn"
                      onClick={() => handleRemovePreview(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== EXISTENTES EN EDICIÓN ==================== */}
          {formData.existingImages.length > 0 && (
            <div className="image-preview-container">
              <p className="form-label">Imágenes actuales:</p>
              <div className="image-preview-grid">
                {formData.existingImages.map((img, idx) => (
                  <div key={idx} className="image-preview-wrapper">
                    <img
                      src={getImageUrl(img)}
                      alt="prev"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="delete-preview-btn"
                      onClick={() => handleRemoveExistingImage(img)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== LISTA DE PRODUCTOS ==================== */}
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
                          src={getImageUrl(
                            product.images?.[0] || product.image
                          )}
                          alt={product.name}
                          className="product-image-list primary"
                        />
                        {product.images && product.images[1] && (
                          <img
                            src={getImageUrl(product.images[1])}
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
                  style={{ opacity: 0 }}
                ></div>
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

          {/* PAGINACIÓN */}
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
