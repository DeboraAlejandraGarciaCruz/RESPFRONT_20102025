import { useState } from 'react';
import { useColors } from '../../context/ColorContext';
import { IoIosAddCircle } from 'react-icons/io';

export default function ColorForm() {
  const { colors, addColor, updateColor, deleteColor } = useColors();
  const [colorName, setColorName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!colorName.trim()) return;

    try {
      if (editingId) {
        await updateColor(editingId, { name: colorName });
        setEditingId(null);
      } else {
        await addColor({ name: colorName });
      }
      setColorName('');
    } catch (err) {
      console.error('Error guardando color:', err);
    }
  };

  return (
    <div className="management-card">
      <h3 className="management-title">🎨 Gestión de Colores</h3>

      <form onSubmit={handleSubmit} className="mini-form">
        <input
          type="text"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="Ej: Rojo, Azul, Negro..."
          className="mini-form-input"
          required
        />
        <button type="submit" className="mini-submit-button">
          <IoIosAddCircle style={{ color: '#fffff' }} />
          {editingId ? ' Actualizar ' : ' Agregar '}
        </button>
      </form>

      <div className="items-list">
        {colors.map((col) => (
          <div key={col._id} className="item-list-item">
            <span>{col.name}</span>
            <div className="item-actions">
              <button
                className="edit-button"
                onClick={() => {
                  setEditingId(col._id);
                  setColorName(col.name);
                }}
              >
                Editar
              </button>
              <button
                className="delete-button"
                onClick={() => deleteColor(col._id)}
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
