import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

const colors = {
  primary: {
    main: '#0097a6',
    light: '#00adc0',
    dark: '#007d8a',
  },
  secondary: {
    main: '#09589f',
    light: '#0a69bd',
    dark: '#074781',
  }
};

const Login: React.FC = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [, setError] = useState('');//error
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await loginUser(correo, contrasena);

      if ((user as any).error) {
        toast.error((user as any).error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setError((user as any).error);
        return;
      }

      setAuth('token-temporal', user);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ocurrió un error al iniciar sesión';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(45deg, ${colors.primary.main}, ${colors.secondary.main})`,
          }}
        />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Diaconía Logo"
              className="mx-auto h-20 mb-6"
            />
            <h2 className="text-2xl font-bold" style={{ color: colors.secondary.main }}>
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingrese sus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ 
                  borderColor: colors.primary.main,
                  '--tw-ring-color': colors.primary.light,
                  '--tw-ring-opacity': 0.2,
                } as React.CSSProperties}
                placeholder="ejemplo@diaconia.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ 
                  borderColor: colors.primary.main,
                  '--tw-ring-color': colors.primary.light,
                  '--tw-ring-opacity': 0.2,
                } as React.CSSProperties}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(45deg, ${colors.primary.main}, ${colors.secondary.main})`,
              }}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
