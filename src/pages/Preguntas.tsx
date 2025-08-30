import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { HiSearch, HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import clsx from "clsx";
import { useAuthStore } from "../store/authStore";

interface Bloque {
  id?: number;
  titulo_bloque: string;
}

interface Pregunta {
  id?: number;
  id_bloque: number;
  nro_pregunta: number;
  titulo_pregunta: string;
  tipo: string;
  estado: number;
  usuario_creacion: string;
  usuario_modificacion?: string;
}

const API_URL = process.env.REACT_APP_API_URL;

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

const Preguntas: React.FC = () => {
  const { user } = useAuthStore();
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPregunta, setSelectedPregunta] = useState<Pregunta | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const preguntasPerPage = 5;

  // Cargar preguntas y bloques
  const fetchPreguntas = async () => {
    try {
      const res = await axios.get(`${API_URL}/preguntas`);
      setPreguntas(res.data);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  };

  const fetchBloques = async () => {
    try {
      const res = await axios.get(`${API_URL}/bloques`);
      setBloques(res.data);
    } catch (error) {
      console.error("Error al obtener bloques:", error);
    }
  };

  useEffect(() => {
    fetchPreguntas();
    fetchBloques();
  }, []);

  // Abrir modal Crear/Editar
  const openModal = (pregunta: Pregunta | null = null) => {
    if (pregunta) {
      // Edición: mantener usuario_creacion y agregar usuario_modificacion
      setSelectedPregunta({
        ...pregunta,
        usuario_modificacion: `${user?.nombre}.${user?.apellido}`,
      });
    } else {
      // Creación: solo usuario_creacion
      setSelectedPregunta({
        id_bloque: bloques[0]?.id || 0,
        nro_pregunta: 0,
        titulo_pregunta: "",
        tipo: "abierta",
        estado: 1,
        usuario_creacion: `${user?.nombre}.${user?.apellido}`,
      });
    }
    setShowModal(true);
  };

  // Guardar pregunta
  const handleSave = async () => {
    if (!selectedPregunta) return;
    try {
      if (selectedPregunta.id) {
        await axios.put(`${API_URL}/preguntas/${selectedPregunta.id}`, selectedPregunta);
      } else {
        await axios.post(`${API_URL}/preguntas`, selectedPregunta);
      }
      setShowModal(false);
      fetchPreguntas();
    } catch (error) {
      console.error("Error al guardar pregunta:", error);
    }
  };

  // Modal eliminar
  const confirmDelete = (pregunta: Pregunta) => {
    setDeleteId(pregunta.id || null);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/preguntas/${deleteId}`);
      setShowDeleteModal(false);
      fetchPreguntas();
    } catch (error) {
      console.error("Error al eliminar pregunta:", error);
    }
  };

  // Filtrar preguntas por término de búsqueda
  const filteredPreguntas = preguntas.filter((pregunta) =>
    pregunta.titulo_pregunta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * preguntasPerPage;
  const indexOfFirst = indexOfLast - preguntasPerPage;
  const currentPreguntas = filteredPreguntas.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPreguntas.length / preguntasPerPage);

  return (
    <div className="min-h-screen bg-gray-200/50 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Preguntas de los Cuestionarios</h1>
            <p className="text-xs text-gray-500">Gestión de preguntas</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-200"
            style={{ backgroundColor: colors.secondary.main, color: 'white' }}
          >
            <HiPlus className="h-4 w-4 mr-1.5" />
            Nueva Pregunta
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
                placeholder="Buscar pregunta..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:ring-1 focus:ring-opacity-50"
                style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
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
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Bloque</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Nro Pregunta</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Título</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Estado</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-white tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPreguntas.map((preg) => (
                <tr key={preg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-900">{preg.id}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {bloques.find((b) => b.id === preg.id_bloque)?.titulo_bloque}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{preg.nro_pregunta}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{preg.titulo_pregunta}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{preg.tipo}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      preg.estado === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {preg.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openModal(preg)}
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
                        onClick={() => confirmDelete(preg)}
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
              Mostrando {indexOfFirst + 1} a {Math.min(indexOfLast, preguntas.length)} de {preguntas.length}
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

      {/* Modal Crear/Editar */}
      {showModal && selectedPregunta && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium" style={{ color: colors.secondary.main }}>
                  {selectedPregunta.id ? "Editar Pregunta" : "Nueva Pregunta"}
                </h3>
              </div>
              
              <div className="p-4 space-y-3">
                {/* Form fields */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bloque</label>
                  <select
                    value={selectedPregunta.id_bloque}
                    onChange={(e) =>
                      setSelectedPregunta({ ...selectedPregunta, id_bloque: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  >
                    {bloques.map((b) => (
                      <option key={b.id} value={b.id}>{b.titulo_bloque}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nro Pregunta</label>
                  <input
                    type="number"
                    value={selectedPregunta.nro_pregunta}
                    onChange={(e) =>
                      setSelectedPregunta({ ...selectedPregunta, nro_pregunta: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Título Pregunta</label>
                  <input
                    type="text"
                    value={selectedPregunta.titulo_pregunta}
                    onChange={(e) =>
                      setSelectedPregunta({ ...selectedPregunta, titulo_pregunta: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={selectedPregunta.tipo}
                    onChange={(e) =>
                      setSelectedPregunta({ ...selectedPregunta, tipo: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  >
                    <option value="abierta">Abierta</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={selectedPregunta.estado}
                    onChange={(e) =>
                      setSelectedPregunta({ ...selectedPregunta, estado: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded"
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

      {/* Modal Eliminar */}
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
                    <h3 className="text-sm font-medium text-gray-900">Eliminar Pregunta</h3>
                    <p className="mt-2 text-xs text-gray-500">
                      ¿Está seguro que desea eliminar esta pregunta? Esta acción no se puede deshacer.
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

export default Preguntas;
