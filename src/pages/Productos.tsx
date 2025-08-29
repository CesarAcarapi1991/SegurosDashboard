import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import clsx from "clsx";
import { useAuthStore } from '../store/authStore';

interface Empresa {
  id?: number;
  nombre: string;
}

interface Producto {
  id?: number;
  empresa_id: number;
  producto: string;
  precio: string;
  descripcion: string;
  formato_certificado: string;
  edad_minima: number;
  edad_maxima: number;
  cantidad_beneficiario: number;
  estado: number;
  usuario_creacion: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const Productos: React.FC = () => {
  const { user } = useAuthStore();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productosPerPage = 5;

  // Cargar productos y empresas
  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/productos`);
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const res = await axios.get(`${API_URL}/empresas`);
      setEmpresas(res.data);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchEmpresas();
  }, []);

  // Abrir modal Crear/Editar
  const openModal = (producto: Producto | null = null) => {
    if (producto) {
      setSelectedProducto(producto);
    } else {
      setSelectedProducto({
        empresa_id: empresas[0]?.id || 0,
        producto: "",
        precio: "",
        descripcion: "",
        formato_certificado: "pdf",
        edad_minima: 0,
        edad_maxima: 0,
        cantidad_beneficiario: 1,
        estado: 1,
        usuario_creacion: `${user?.nombre}.${user?.apellido}`,
      });
    }
    setShowModal(true);
  };

  // Guardar producto
  const handleSave = async () => {
    if (!selectedProducto) return;
    try {
      if (selectedProducto.id) {
        await axios.put(`${API_URL}/productos/${selectedProducto.id}`, selectedProducto);
      } else {
        await axios.post(`${API_URL}/productos`, selectedProducto);
      }
      setShowModal(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  // Modal eliminar
  const confirmDelete = (producto: Producto) => {
    setDeleteId(producto.id || null);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/productos/${deleteId}`);
      setShowDeleteModal(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // Paginación
  const indexOfLast = currentPage * productosPerPage;
  const indexOfFirst = indexOfLast - productosPerPage;
  const currentProductos = productos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productos.length / productosPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-sm font-semibold text-gray-800">Productos</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs shadow hover:bg-blue-700 transition"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 text-sm shadow-lg rounded-md overflow-hidden">
          <thead className="bg-gray-900 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="border px-2 py-2 text-center">ID</th>
              <th className="border px-2 py-2 text-left">Empresa</th>
              <th className="border px-2 py-2 text-left">Producto</th>
              <th className="border px-2 py-2 text-left">Precio</th>
              <th className="border px-2 py-2 text-left">Descripción</th>
              <th className="border px-2 py-2 text-left">Estado</th>
              <th className="border px-2 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProductos.map((prod, idx) => (
              <tr
                key={prod.id}
                className={clsx(
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white",
                  "hover:bg-gray-100 transition-colors"
                )}
              >
                <td className="border px-2 py-2 text-center">{prod.id}</td>
                <td className="border px-2 py-2">{empresas.find(e => e.id === prod.empresa_id)?.nombre}</td>
                <td className="border px-2 py-2">{prod.producto}</td>
                <td className="border px-2 py-2">{prod.precio}</td>
                <td className="border px-2 py-2">{prod.descripcion}</td>
                <td className="border px-2 py-2">{prod.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td className="border px-2 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => openModal(prod)}
                    className="bg-yellow-200 text-yellow-800 p-1 rounded hover:bg-yellow-300 shadow-sm"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={() => confirmDelete(prod)}
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
      {showModal && selectedProducto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-sm font-semibold mb-4">
              {selectedProducto.id ? "Editar Producto" : "Nuevo Producto"}
            </h3>

            {/* Select de empresa */}
            <label className="text-xs font-medium">Empresa</label>
            <select
              value={selectedProducto.empresa_id}
              onChange={(e) =>
                setSelectedProducto({ ...selectedProducto, empresa_id: Number(e.target.value) })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            >
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Producto"
              value={selectedProducto.producto}
              onChange={(e) =>
                setSelectedProducto({ ...selectedProducto, producto: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Precio"
              value={selectedProducto.precio}
              onChange={(e) =>
                setSelectedProducto({ ...selectedProducto, precio: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />
            <textarea
              placeholder="Descripción"
              value={selectedProducto.descripcion}
              onChange={(e) =>
                setSelectedProducto({ ...selectedProducto, descripcion: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Formato Certificado"
              value={selectedProducto.formato_certificado}
              onChange={(e) =>
                setSelectedProducto({ ...selectedProducto, formato_certificado: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />
            <div className="flex space-x-2 mb-2">
              <input
                type="number"
                placeholder="Edad mínima"
                value={selectedProducto.edad_minima}
                onChange={(e) =>
                  setSelectedProducto({ ...selectedProducto, edad_minima: Number(e.target.value) })
                }
                className="w-1/2 border px-2 py-1 rounded text-sm"
              />
              <input
                type="number"
                placeholder="Edad máxima"
                value={selectedProducto.edad_maxima}
                onChange={(e) =>
                  setSelectedProducto({ ...selectedProducto, edad_maxima: Number(e.target.value) })
                }
                className="w-1/2 border px-2 py-1 rounded text-sm"
              />
            </div>
            <input
              type="number"
              placeholder="Cantidad beneficiarios"
              value={selectedProducto.cantidad_beneficiario}
              onChange={(e) =>
                setSelectedProducto({
                  ...selectedProducto,
                  cantidad_beneficiario: Number(e.target.value),
                })
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-sm font-semibold mb-4 text-red-600">
              ¿Eliminar Producto?
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

export default Productos;
