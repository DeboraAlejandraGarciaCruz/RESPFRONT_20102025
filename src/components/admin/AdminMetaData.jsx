import { useState, useEffect } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { useColors } from '../../context/ColorContext';

export default function AdminMetaData() {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const { colors, fetchColors, addColor, updateColor, deleteColor } =
    useColors();

  const [activeTab, setActiveTab] = useState('categories');

  const [newCategory, setNewCategory] = useState('');
  const [newColor, setNewColor] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingColor, setEditingColor] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchColors();
  }, [fetchCategories, fetchColors]);

  // --- CRUD handlers ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory({ name: newCategory });
    setNewCategory('');
  };

  const handleAddColor = async () => {
    if (!newColor.trim()) return;
    await addColor({ name: newColor });
    setNewColor('');
  };

  const handleUpdateCategory = async (id) => {
    await updateCategory(id, { name: editingCategory.name });
    setEditingCategory(null);
  };

  const handleUpdateColor = async (id) => {
    await updateColor(id, { name: editingColor.name });
    setEditingColor(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'categories'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Categorías
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'colors'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Colores
        </button>
      </div>

      {/* Categorías */}
      {activeTab === 'categories' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Administrar Categorías</h2>
          <div className="flex mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría"
              className="flex-1 border px-3 py-2 rounded-l"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>

          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                {editingCategory?._id === cat._id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="flex-1 border px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => handleUpdateCategory(cat._id)}
                      className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Colores */}
      {activeTab === 'colors' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Administrar Colores</h2>
          <div className="flex mb-4">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Nuevo color"
              className="flex-1 border px-3 py-2 rounded-l"
            />
            <button
              onClick={handleAddColor}
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>

          <ul className="space-y-2">
            {colors.map((color) => (
              <li
                key={color._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                {editingColor?._id === color._id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingColor.name}
                      onChange={(e) =>
                        setEditingColor({
                          ...editingColor,
                          name: e.target.value,
                        })
                      }
                      className="flex-1 border px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => handleUpdateColor(color._id)}
                      className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{color.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingColor(color)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteColor(color._id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
