// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('User state changed:', user);
    console.log('Loading state:', loading);
  }, [user, loading]);

  // useEffect para verificar autenticación - DENTRO del componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');

        if (token && userData) {
          // Verificar con el backend si el token es válido
          try {
            const response = await fetch(
              'http://localhost:5000/api/auth/verify',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              setUser(JSON.parse(userData));
            } else {
              // Token inválido, limpiar localStorage
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUser');
            }
          } catch (error) {
            console.log('Backend no disponible, usando datos locales');
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
