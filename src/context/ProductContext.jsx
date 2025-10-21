import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { apiFetch } from '../utils/api';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      console.log('Fetching products...'); // Para debug
      const data = await apiFetch('/api/products/public');
      setProducts(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
