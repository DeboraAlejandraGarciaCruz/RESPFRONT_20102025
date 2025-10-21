// src/components/admin/AdminLogin.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (error) {
      setError(
        'Error de conexión con el servidor. Verifica que el backend esté ejecutándose.'
      );
      console.error('Error de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-halagos-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="contact-form-container max-w-md w-full p-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold text-halagos-dark">
            Acceso Administrador
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-lg font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-semibold">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input w-full"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`button-halagos-fixed-size w-full ${
                isLoading ? 'disabled' : ''
              }`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
