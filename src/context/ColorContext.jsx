import { createContext, useContext, useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';

const ColorContext = createContext();
export const useColors = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener colores
  const fetchColors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/colors');
      setColors(res);
    } catch (err) {
      console.error('Error cargando colores:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear categoría
  const addColor = async (newCat) => {
    const data = await apiFetch('/api/colors', {
      method: 'POST',
      body: newCat, // 👈 ya no stringify
    });
    setColors((prev) => [...prev, data]);
  };

  // Editar categoría
  const updateColor = async (id, updated) => {
    const data = await apiFetch(`/api/colors/${id}`, {
      method: 'PUT',
      body: updated, // 👈 igual aquí
    });
    setColors((prev) => prev.map((c) => (c._id === id ? data : c)));
  };

  // Eliminar color
  const deleteColor = async (id) => {
    await apiFetch(`/api/colors/${id}`, { method: 'DELETE' });
    setColors((prev) => prev.filter((color) => color._id !== id));
  };

  return (
    <ColorContext.Provider
      value={{
        colors,
        loading,
        fetchColors,
        addColor,
        updateColor,
        deleteColor,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};
