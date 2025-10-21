import { useState } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { IoIosAddCircle } from 'react-icons/io';

export default function CategoryForm() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, { name: categoryName });
        setEditingId(null);
      } else {
        await addCategory({ name: categoryName });
      }
      setCategoryName('');
    } catch (err) {
      console.error('Error guardando categoría:', err);
    }
  };

  return (
    <div className="management-card">
      <h3 className="management-title"> Gestión de Categorías</h3>

      <form onSubmit={handleSubmit} className="mini-form">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Ej: Panties, Corte Frances..."
          className="mini-form-input"
          required
        />
        <button type="submit" className="mini-submit-button">
          <IoIosAddCircle style={{ color: '#fffff' }} />
          {editingId ? ' Actualizar' : ' Agregar'}
        </button>
      </form>

      <div className="items-list">
        {categories.map((cat) => (
          <div key={cat._id} className="item-list-item">
            <span>{cat.name}</span>
            <div className="item-actions">
              <button
                className="edit-button"
                onClick={() => {
                  setEditingId(cat._id);
                  setCategoryName(cat.name);
                }}
              >
                Editar
              </button>
              <button
                className="delete-button"
                onClick={() => deleteCategory(cat._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
