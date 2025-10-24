// src/pages/ContactPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const productName = searchParams.get('productName');
    if (productName) {
      setFormData((prevData) => ({
        ...prevData,
        message: `Hola, me gustaría consultar la disponibilidad de: ${productName}.`,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('Mensaje enviado con éxito. Te contactaremos pronto.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Error al enviar el mensaje. Intenta nuevamente.');
      }
    } catch (error) {
      setStatus('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Encabezado */}
      <div className="contact-header-bg py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">CONTÁCTANOS</h1>
      </div>

      {/* Contenedor de dos columnas: Utilizamos la nueva clase CSS */}
      <div className="contact-columns-wrapper">
        {/* LADO IZQUIERDO - Formulario */}
        <div className="contact-form-container p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-semibold mb-1"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="form-input w-full"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="button-halagos-fixed-size"
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
          {status && (
            <p
              className={`mt-4 text-center text-sm ${
                status.includes('éxito') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status}
            </p>
          )}
        </div>

        {/* LADO DERECHO - Información de contacto */}
        <div className="contact-info-container rounded-xl shadow-md p-8 text-center">
          <h2 className="text-4xl font-bold text-halagos-dark mb-1">
            ¿Necesitas más ayuda?
          </h2>
          <h3 className="text-3x1 font-medium text-halagos-pink mb-3">
            Queremos escucharte.
          </h3>
          <p className=".text-black-contact mb-2">
            Ponte en contacto con nosotros.
          </p>
          <p className=".text-black-contact mb-2">
            <strong>Vía Email</strong> de Lunes a Viernes <br />
            07:00 - 16:30 hrs. <br />
            <span className="font-medium">halagosunderweare@gmail.com</span>
          </p>
          <p className=".text-black-contact mb-6">
            <strong>Llámanos</strong> de Lunes a Viernes <br />
            08:00 - 16:00 hrs. <br />
            <span className="font-medium">Tel: 76 1688 1492</span>
          </p>

          {/* Redes Sociales */}
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://www.facebook.com/profile.php?id=61578304032433"
              target="_blank"
              rel="noopener noreferrer"
              className="text-halagos-dark transition-colors"
            >
              <Facebook size={28} />
            </a>
            <a
              href="https://www.instagram.com/halagos2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-halagos-dark transition-colors"
            >
              <Instagram size={28} />
            </a>
            <a
              href="/link-a-tiktok"
              target="_blank"
              rel="noopener noreferrer"
              className="text-halagos-dark transition-colors"
            >
              <SiTiktok size={28} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
