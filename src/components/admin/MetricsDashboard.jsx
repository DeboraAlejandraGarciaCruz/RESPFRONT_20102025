import { useMetrics } from '../../context/MetricsContext';
import { useProducts } from '../../context/ProductContext';

export default function MetricsDashboard() {
  const { productViews } = useMetrics();
  const { products } = useProducts();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Métricas de Productos
      </h2>
      {products.map((product) => (
        <div
          key={product.id}
          className="flex justify-between items-center bg-gray-100 p-3 rounded"
        >
          <span>{product.name}</span>
          <span className="font-semibold">
            {productViews[product.id] || 0} vistas
          </span>
        </div>
      ))}
    </div>
  );
}
