import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import clsx from "clsx";
import { useAuthStore } from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL;

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
  const currentEmpresas = empresas.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(empresas.length / empresasPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-sm font-semibold text-gray-800">Empresas</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs shadow hover:bg-blue-700 transition"
        >
          + Nueva Empresa
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 text-sm shadow-lg rounded-md overflow-hidden">
          <thead className="bg-gray-900 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="border px-2 py-2 text-center">ID</th>
              <th className="border px-2 py-2 text-left">Nombre</th>
              <th className="border px-2 py-2 text-left">Descripción</th>
              <th className="border px-2 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentEmpresas.map((emp, idx) => (
              <tr
                key={emp.id}
                className={clsx(
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white",
                  "hover:bg-gray-100 transition-colors"
                )}
              >
                <td className="border px-2 py-2 text-center">{emp.id}</td>
                <td className="border px-2 py-2">{emp.nombre}</td>
                <td className="border px-2 py-2">{emp.descripcion}</td>
                <td className="border px-2 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => openModal(emp)}
                    className="bg-yellow-200 text-yellow-800 p-1 rounded hover:bg-yellow-300 shadow-sm"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={() => confirmDelete(emp)}
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
      {showModal && selectedEmpresa && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-sm font-semibold mb-4">
              {selectedEmpresa.id ? "Editar Empresa" : "Nueva Empresa"}
            </h3>
            <input
              type="text"
              placeholder="Nombre"
              value={selectedEmpresa.nombre}
              onChange={(e) =>
                setSelectedEmpresa({ ...selectedEmpresa, nombre: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />
            <textarea
              placeholder="Descripción"
              value={selectedEmpresa.descripcion}
              onChange={(e) =>
                setSelectedEmpresa({ ...selectedEmpresa, descripcion: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-sm font-semibold mb-4 text-red-600">
              ¿Eliminar Empresa?
            </h3>
            <p className="text-xs mb-4 text-gray-600">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
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

export default Empresas;
