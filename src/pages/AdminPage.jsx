import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductForm from '../components/admin/ProductForm';
import AdminMetaData from '../components/admin/AdminMetaData';

export default function AdminPage() {
  const { fetchProducts } = useProducts();
  const [productToEdit, setProductToEdit] = useState(null);

  // Cargar productos al entrar al panel
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = () => {
    setProductToEdit(null); // limpiar el form cuando guardes
    fetchProducts(); // recargar productos después de agregar/editar
  };

  return (
    <div className="contact-page min-h-screen">
      {/* Encabezado para panel de administracion*/}
      <div className="contact-header-bg py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
          {' '}
          PANEL DE ADMINISTRACIÓN
        </h1>
      </div>

      {/* Productos */}
      <div>
        <ProductForm />
      </div>
    </div>
  );
}
