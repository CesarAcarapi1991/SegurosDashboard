import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   try {
  //     const user = await loginUser(correo, contrasena);
  //     setAuth('token-falso-por-ahora', user); // si tu API no devuelve token, guarda null o JWT si existe
  //     navigate('/dashboard');
  //   } catch (err) {
  //     setError('Correo o contraseña incorrectos');
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await loginUser(correo, contrasena);

      // Verificar si hay error en la respuesta
      if ((user as any).error) {
        setError((user as any).error);
        return;
      }

      // Guardar usuario en estado global
      setAuth('token-temporal', user); // si tu backend no devuelve JWT real
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocurrió un error al iniciar sesión');
      console.error(err);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center font-semibold">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
