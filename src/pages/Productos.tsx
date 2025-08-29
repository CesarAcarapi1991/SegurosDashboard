import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { HiSearch } from 'react-icons/hi';
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

const Productos: React.FC = () => {
  const { user } = useAuthStore();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Add search filter
  const filteredProductos = productos.filter(producto =>
    producto.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresas.find(e => e.id === producto.empresa_id)?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * productosPerPage;
  const indexOfFirst = indexOfLast - productosPerPage;
  const currentProductos = filteredProductos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProductos.length / productosPerPage);

  return (
    <div className="min-h-screen bg-gray-200/50 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Productos</h1>
            <p className="text-xs text-gray-500">Gestión de productos de seguros</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-200"
            style={{
              backgroundColor: colors.secondary.main,
              color: 'white',
            }}
          >
            + Nuevo Producto
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
                placeholder="Buscar producto..."
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
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Empresa</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Producto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Precio</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Estado</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-white tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentProductos.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-900">{prod.id}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{empresas.find(e => e.id === prod.empresa_id)?.nombre}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{prod.producto}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{prod.precio}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      prod.estado === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {prod.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openModal(prod)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded transition-colors"
                        style={{
                          color: colors.secondary.main,
                          backgroundColor: colors.secondary.bg,
                        }}
                      >
                        <FaPencilAlt className="h-3 w-3 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => confirmDelete(prod)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <FaTrash className="h-3 w-3 mr-1" />
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
              Mostrando {indexOfFirst + 1} a {Math.min(indexOfLast, productos.length)} de {productos.length}
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

      {/* Create/Edit Modal */}
      {showModal && selectedProducto && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium" style={{ color: colors.secondary.main }}>
                  {selectedProducto.id ? "Editar Producto" : "Nuevo Producto"}
                </h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Empresa</label>
                  <select
                    value={selectedProducto.empresa_id}
                    onChange={(e) => setSelectedProducto({ ...selectedProducto, empresa_id: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  >
                    {empresas.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Producto</label>
                  <input
                    type="text"
                    value={selectedProducto.producto}
                    onChange={(e) => setSelectedProducto({ ...selectedProducto, producto: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Precio</label>
                  <input
                    type="text"
                    value={selectedProducto.precio}
                    onChange={(e) => setSelectedProducto({ ...selectedProducto, precio: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={selectedProducto.descripcion}
                    onChange={(e) => setSelectedProducto({ ...selectedProducto, descripcion: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Formato Certificado</label>
                  <input
                    type="text"
                    value={selectedProducto.formato_certificado}
                    onChange={(e) => setSelectedProducto({ ...selectedProducto, formato_certificado: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Edad mínima</label>
                    <input
                      type="number"
                      value={selectedProducto.edad_minima}
                      onChange={(e) => setSelectedProducto({ ...selectedProducto, edad_minima: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                      style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Edad máxima</label>
                    <input
                      type="number"
                      value={selectedProducto.edad_maxima}
                      onChange={(e) => setSelectedProducto({ ...selectedProducto, edad_maxima: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                      style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad beneficiarios</label>
                  <input
                    type="number"
                    value={selectedProducto.cantidad_beneficiario}
                    onChange={(e) => setSelectedProducto({ ...selectedProducto, cantidad_beneficiario: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border focus:ring-1"
                    style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
                  />
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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm">
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTrash className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Eliminar Producto</h3>
                    <p className="mt-2 text-xs text-gray-500">
                      ¿Está seguro que desea eliminar este producto? Esta acción no se puede deshacer.
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

export default Productos;
