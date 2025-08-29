import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiPencil, HiTrash, HiSearch, HiPlus } from 'react-icons/hi';
import clsx from "clsx";
import { useAuthStore } from '../store/authStore';
import { FaTrash } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

// Actualizar los colores para incluir el tema intermedio
const colors = {
  primary: {
    main: '#0097a6',
    light: '#00adc0',
    dark: '#007d8a',
    bg: 'rgba(0, 151, 166, 0.1)',
  },
  secondary: {
    main: '#09589f',
    light: '#0a69bd',
    dark: '#074781',
    bg: 'rgba(9, 88, 159, 0.1)',
  },
  gray: {
    main: '#374151',
    light: '#e5e7eb',
    bg: 'rgba(55, 65, 81, 0.05)',
  }
};

interface Empresa {
  id?: number;
  nombre: string;
  descripcion: string;
  marcabaja?: boolean;
  usuario_creacion: string;
  fecha_creacion?: string;
}

const Empresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const empresasPerPage = 5;

  // Cargar empresas
  const fetchEmpresas = async () => {
    try {
      const res = await axios.get(`${API_URL}/empresas`);
      setEmpresas(res.data);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const user = useAuthStore((state) => state.user);

  // Abrir modal Crear/Editar
  const openModal = (empresa: Empresa | null = null) => {
    setSelectedEmpresa(
      empresa || { nombre: "", descripcion: "", usuario_creacion: `${user?.nombre}.${user?.apellido}`.toLowerCase()
 }
    );
    setShowModal(true);
  };

  // Guardar empresa
  const handleSave = async () => {
    if (!selectedEmpresa) return;
    try {
      if (selectedEmpresa.id) {
        await axios.put(
          `${API_URL}/empresas/${selectedEmpresa.id}`,
          selectedEmpresa
        );
      } else {
        await axios.post(`${API_URL}/empresas`, selectedEmpresa);
      }
      setShowModal(false);
      fetchEmpresas();
    } catch (error) {
      console.error("Error al guardar empresa:", error);
    }
  };

  // Abrir modal eliminar
  const confirmDelete = (empresa: Empresa) => {
    setDeleteId(empresa.id || null);
    setShowDeleteModal(true);
  };

  // Eliminar empresa
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/empresas/${deleteId}`);
      setShowDeleteModal(false);
      fetchEmpresas();
    } catch (error) {
      console.error("Error al eliminar empresa:", error);
    }
  };

  // Paginación
  const indexOfLast = currentPage * empresasPerPage;
  const indexOfFirst = indexOfLast - empresasPerPage;

  // Función de búsqueda
  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Actualizar paginación para usar empresas filtradas
  const currentEmpresas = filteredEmpresas.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEmpresas.length / empresasPerPage);

  return (
    <div className="min-h-screen bg-gray-200/50 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Empresas Aseguradoras</h1>
            <p className="text-xs text-gray-500">Gestión de empresas aseguradoras</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-200"
            style={{
              backgroundColor: colors.secondary.main,
              color: 'white',
            }}
          >
            <HiPlus className="h-4 w-4 mr-1.5" />
            Nueva Empresa
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex">
          <div className="w-full max-w-xs">
            <div className="relative">
              <HiSearch className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar empresa..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:ring-1 focus:ring-opacity-50"
                style={{
                  borderColor: colors.gray.light,
                  '--tw-ring-color': colors.secondary.main,
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-[#09589f]">
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Nombre Aseguradora</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Descripción</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-white tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentEmpresas.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-900">{emp.id}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{emp.nombre}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{emp.descripcion}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openModal(emp)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded transition-colors"
                        style={{
                          color: colors.secondary.main,
                          backgroundColor: colors.secondary.bg,
                        }}
                      >
                        <HiPencil className="h-3 w-3 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => confirmDelete(emp)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <HiTrash className="h-3 w-3 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Mostrando {indexOfFirst + 1} a {Math.min(indexOfLast, empresas.length)} de {empresas.length}
            </p>
            <nav className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={clsx(
                    "px-2.5 py-1 text-xs font-medium rounded transition-colors",
                    currentPage === idx + 1
                      ? "text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                  style={
                    currentPage === idx + 1 
                      ? { backgroundColor: colors.secondary.main }
                      : undefined
                  }
                >
                  {idx + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar mejorado */}
      {showModal && selectedEmpresa && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium" style={{ color: colors.secondary.main }}>
                  {selectedEmpresa.id ? "Editar Empresa" : "Nueva Empresa"}
                </h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={selectedEmpresa.nombre}
                    onChange={(e) => setSelectedEmpresa({ ...selectedEmpresa, nombre: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                    placeholder="Ingrese el nombre de la empresa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={selectedEmpresa.descripcion}
                    onChange={(e) => setSelectedEmpresa({ ...selectedEmpresa, descripcion: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                    rows={3}
                  />
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-xs font-medium text-white rounded"
                  style={{ backgroundColor: colors.secondary.main }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar mejorado */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTrash className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Eliminar Empresa</h3>
                    <p className="mt-2 text-xs text-gray-500">
                      ¿Está seguro que desea eliminar esta empresa? Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-xs font-medium text-white rounded bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empresas;