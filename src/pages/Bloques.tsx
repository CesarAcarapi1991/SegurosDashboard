import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { HiSearch } from "react-icons/hi";
import clsx from "clsx";
import { useAuthStore } from "../store/authStore";

interface Producto {
  id?: number;
  producto: string;
}

interface Bloque {
  id?: number;
  id_producto: number;
  nro_bloque: number;
  titulo_bloque: string;
  estado: number;
  usuario_creacion: string;
  usuario_modificacion?: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const Bloques: React.FC = () => {
  const { user } = useAuthStore();
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBloque, setSelectedBloque] = useState<Bloque | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const bloquesPerPage = 5;

  // Cargar bloques y productos
  const fetchBloques = async () => {
    try {
      const res = await axios.get(`${API_URL}/bloques`);
      setBloques(res.data);
    } catch (error) {
      console.error("Error al obtener bloques:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/productos`);
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchBloques();
    fetchProductos();
  }, []);

  // Abrir modal Crear/Editar
  const openModal = (bloque: Bloque | null = null) => {
    if (bloque) {
      // Edición: mantener usuario_creacion, agregar usuario_modificacion
      setSelectedBloque({
        ...bloque,
        usuario_modificacion: `${user?.nombre}.${user?.apellido}`,
      });
    } else {
      // Creación: solo usuario_creacion
      setSelectedBloque({
        id_producto: productos[0]?.id || 0,
        nro_bloque: 0,
        titulo_bloque: "",
        estado: 1,
        usuario_creacion: `${user?.nombre}.${user?.apellido}`,
      });
    }
    setShowModal(true);
  };

  // Guardar bloque
  const handleSave = async () => {
    if (!selectedBloque) return;
    try {
      if (selectedBloque.id) {
        await axios.put(`${API_URL}/bloques/${selectedBloque.id}`, selectedBloque);
      } else {
        await axios.post(`${API_URL}/bloques`, selectedBloque);
      }
      setShowModal(false);
      fetchBloques();
    } catch (error) {
      console.error("Error al guardar bloque:", error);
    }
  };

  // Modal eliminar
  const confirmDelete = (bloque: Bloque) => {
    setDeleteId(bloque.id || null);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/bloques/${deleteId}`);
      setShowDeleteModal(false);
      fetchBloques();
    } catch (error) {
      console.error("Error al eliminar bloque:", error);
    }
  };

  // Paginación
  const indexOfLast = currentPage * bloquesPerPage;
  const indexOfFirst = indexOfLast - bloquesPerPage;

  // Add search filter
  const filteredBloques = bloques.filter(bloque =>
    bloque.titulo_bloque.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update pagination
  const currentBloques = filteredBloques.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBloques.length / bloquesPerPage);

  return (
    <div className="min-h-screen bg-gray-200/50 p-4">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        {/* Header */}
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-sm font-semibold text-gray-800">Bloques</h2>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs shadow hover:bg-blue-700 transition"
          >
            + Nuevo Bloque
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título de bloque..."
              className="w-full border px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <HiSearch className="text-gray-400" />
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200 text-sm shadow-lg rounded-md overflow-hidden">
            <thead>
              <tr className="bg-[#09589f]">
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                  Nro Bloque
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                  Título
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-white tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBloques.map((bloq, idx) => (
                <tr
                  key={bloq.id}
                  className={clsx(
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white",
                    "hover:bg-gray-100 transition-colors"
                  )}
                >
                  <td className="border px-2 py-2 text-center">{bloq.id}</td>
                  <td className="border px-2 py-2">
                    {productos.find((p) => p.id === bloq.id_producto)?.producto}
                  </td>
                  <td className="border px-2 py-2">{bloq.nro_bloque}</td>
                  <td className="border px-2 py-2">{bloq.titulo_bloque}</td>
                  <td className="border px-2 py-2">{bloq.estado === 1 ? "Activo" : "Inactivo"}</td>
                  <td className="border px-2 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => openModal(bloq)}
                      className="bg-yellow-200 text-yellow-800 p-1 rounded hover:bg-yellow-300 shadow-sm"
                    >
                      <FaPencilAlt size={14} />
                    </button>
                    <button
                      onClick={() => confirmDelete(bloq)}
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
      {showModal && selectedBloque && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-sm font-semibold mb-4">
              {selectedBloque.id ? "Editar Bloque" : "Nuevo Bloque"}
            </h3>

            {/* Select de producto */}
            <label className="text-xs font-medium">Producto</label>
            <select
              value={selectedBloque.id_producto}
              onChange={(e) =>
                setSelectedBloque({ ...selectedBloque, id_producto: Number(e.target.value) })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            >
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.producto}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Nro Bloque"
              value={selectedBloque.nro_bloque}
              onChange={(e) =>
                setSelectedBloque({ ...selectedBloque, nro_bloque: Number(e.target.value) })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            <input
              type="text"
              placeholder="Título Bloque"
              value={selectedBloque.titulo_bloque}
              onChange={(e) =>
                setSelectedBloque({ ...selectedBloque, titulo_bloque: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            <select
              value={selectedBloque.estado}
              onChange={(e) =>
                setSelectedBloque({ ...selectedBloque, estado: Number(e.target.value) })
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
            <h3 className="text-sm font-semibold mb-4 text-red-600">¿Eliminar Bloque?</h3>
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

export default Bloques;
