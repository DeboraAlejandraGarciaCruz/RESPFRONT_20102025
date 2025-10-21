import { useProducts } from '../../context/ProductContext';
import { apiFetch } from '../../utils/api';

export default function ProductList({ onEdit }) {
  const { products, fetchProducts } = useProducts();

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <p>No hay productos para mostrar. Agrega uno.</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              {(product.images && product.images.length > 0) ||
              product.image ? (
                <div
                  className="product-image-container"
                  style={{ width: 80, height: 80 }}
                >
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="product-image-list primary"
                  />
                  {product.images?.[1] && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} alt`}
                      className="product-image-list secondary"
                    />
                  )}
                </div>
              ) : null}

              <div>
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
