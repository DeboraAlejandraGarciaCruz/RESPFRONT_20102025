import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { MetricsProvider } from './context/MetricsContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { ColorProvider } from './context/ColorContext';
import { CategoryProvider } from './context/CategoryContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <ColorProvider>
          <CategoryProvider>
            <MetricsProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <ScrollToTop />
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/catalogo" element={<CatalogPage />} />
                      <Route
                        path="/producto/:id"
                        element={<ProductDetailPage />}
                      />
                      <Route path="/contacto" element={<ContactPage />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminPage />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </Router>
            </MetricsProvider>
          </CategoryProvider>
        </ColorProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
