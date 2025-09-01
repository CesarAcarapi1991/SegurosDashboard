import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Perfil from '../pages/Perfil';
import Configuracion from '../pages/Configuracion';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';
import Empresas from '../pages/Empresas';
import Productos from '../pages/Productos';
import Bloques from '../pages/Bloques';
import Preguntas from '../pages/Preguntas';
import Certificados from '../pages/Certificados';
import Seguros from '../pages/Seguros';
import Operaciones from '../pages/Operaciones';
import ReporteOperaciones from '../components/ReporteOperaciones';
import Cobro from '../pages/Cobro';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas privadas */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="perfil" element={<Perfil />} /> */}
          
          <Route path="seguros" element={<Seguros />} />
          <Route path="/seguros/operaciones" element={<Operaciones />} />

          <Route path="cobro" element={<Seguros />} />
          <Route path="/cobro/cobro_seguro" element={<Cobro />} />

          <Route path="reportes" element={<Seguros />} />
          <Route path="/reportes/reporte_operaciones" element={<ReporteOperaciones />} />

          <Route path="configuracion" element={<Configuracion />} />
          <Route path="/configuracion/empresas" element={<Empresas />} />
          <Route path="/configuracion/productos" element={<Productos />} />
          <Route path="/configuracion/bloques" element={<Bloques />} />
          <Route path="/configuracion/preguntas" element={<Preguntas />} />
          <Route path="/configuracion/certificados" element={<Certificados />} />
        </Route>
      </Route>

      {/* Cualquier otra ruta redirige a login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
