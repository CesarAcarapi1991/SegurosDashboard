import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { HiSearch } from "react-icons/hi";
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
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-sm font-semibold text-gray-800">Preguntas</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs shadow hover:bg-blue-700 transition"
        >
          + Nueva Pregunta
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por título de pregunta"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-10 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 text-sm shadow-lg rounded-md overflow-hidden">
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
          <tbody>
            {currentPreguntas.map((preg, idx) => (
              <tr
                key={preg.id}
                className={clsx(
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white",
                  "hover:bg-gray-100 transition-colors"
                )}
              >
                <td className="border px-2 py-2 text-center">{preg.id}</td>
                <td className="border px-2 py-2">
                  {bloques.find((b) => b.id === preg.id_bloque)?.titulo_bloque}
                </td>
                <td className="border px-2 py-2">{preg.nro_pregunta}</td>
                <td className="border px-2 py-2">{preg.titulo_pregunta}</td>
                <td className="border px-2 py-2">{preg.tipo}</td>
                <td className="border px-2 py-2">{preg.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td className="border px-2 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => openModal(preg)}
                    className="bg-yellow-200 text-yellow-800 p-1 rounded hover:bg-yellow-300 shadow-sm"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={() => confirmDelete(preg)}
                    className="bg-red-200 text-red-800 p-1 rounded hover:bg-red-300 shadow-sm"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={clsx(
              "px-2 py-1 rounded text-xs border shadow-sm",
              currentPage === idx + 1
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100"
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && selectedPregunta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-sm font-semibold mb-4">
              {selectedPregunta.id ? "Editar Pregunta" : "Nueva Pregunta"}
            </h3>

            {/* Select de bloque */}
            <label className="text-xs font-medium">Bloque</label>
            <select
              value={selectedPregunta.id_bloque}
              onChange={(e) =>
                setSelectedPregunta({ ...selectedPregunta, id_bloque: Number(e.target.value) })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            >
              {bloques.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.titulo_bloque}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Nro Pregunta"
              value={selectedPregunta.nro_pregunta}
              onChange={(e) =>
                setSelectedPregunta({ ...selectedPregunta, nro_pregunta: Number(e.target.value) })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            <input
              type="text"
              placeholder="Título Pregunta"
              value={selectedPregunta.titulo_pregunta}
              onChange={(e) =>
                setSelectedPregunta({ ...selectedPregunta, titulo_pregunta: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            <input
              type="text"
              placeholder="Tipo"
              value={selectedPregunta.tipo}
              onChange={(e) =>
                setSelectedPregunta({ ...selectedPregunta, tipo: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            <select
              value={selectedPregunta.estado}
              onChange={(e) =>
                setSelectedPregunta({ ...selectedPregunta, estado: Number(e.target.value) })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-sm font-semibold mb-4 text-red-600">¿Eliminar Pregunta?</h3>
            <p className="text-xs mb-4 text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preguntas;
