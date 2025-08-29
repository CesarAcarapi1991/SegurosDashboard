import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { HiSearch } from 'react-icons/hi';
import clsx from "clsx";
import { useAuthStore } from "../store/authStore";

interface Producto {
  id?: number;
  producto: string;
}

interface Certificado {
  id?: number;
  id_producto: number;
  codigo: string;
  descripcion: string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
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

const Certificados: React.FC = () => {
  const { user } = useAuthStore();
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const certificadosPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar certificados y productos
  const fetchCertificados = async () => {
    try {
      const res = await axios.get(`${API_URL}/certificados`);
      setCertificados(res.data);
    } catch (error) {
      console.error("Error al obtener certificados:", error);
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
    fetchCertificados();
    fetchProductos();
  }, []);

  // Abrir modal Crear/Editar
  const openModal = (certificado: Certificado | null = null) => {
    if (certificado) {
      setSelectedCertificado(certificado);
    } else {
      setSelectedCertificado({
        id_producto: productos[0]?.id || 0,
        codigo: "",
        descripcion: "",
        fecha_emision: "",
        fecha_vencimiento: "",
        estado: 1,
        usuario_creacion: `${user?.nombre} ${user?.apellido}`,
      });
    }
    setShowModal(true);
  };

  // Guardar certificado
  const handleSave = async () => {
    if (!selectedCertificado) return;
    try {
      if (selectedCertificado.id) {
        await axios.put(`${API_URL}/certificados/${selectedCertificado.id}`, {
          ...selectedCertificado,
          usuario_modificacion: `${user?.nombre} ${user?.apellido}`,
        });
      } else {
        await axios.post(`${API_URL}/certificados`, selectedCertificado);
      }
      setShowModal(false);
      fetchCertificados();
    } catch (error) {
      console.error("Error al guardar certificado:", error);
    }
  };

  // Modal eliminar
  const confirmDelete = (certificado: Certificado) => {
    setDeleteId(certificado.id || null);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/certificados/${deleteId}`);
      setShowDeleteModal(false);
      fetchCertificados();
    } catch (error) {
      console.error("Error al eliminar certificado:", error);
    }
  };

  // Filtrar certificados por búsqueda
  const filteredCertificados = certificados.filter(cert =>
    cert.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * certificadosPerPage;
  const indexOfFirst = indexOfLast - certificadosPerPage;
  const currentCertificados = filteredCertificados.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCertificados.length / certificadosPerPage);

  return (
    <div className="min-h-screen bg-gray-200/50 p-4">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Certificados</h1>
            <p className="text-xs text-gray-500">Gestión de certificados</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-200"
            style={{
              backgroundColor: colors.secondary.main,
              color: 'white',
            }}
          >
            + Nuevo Certificado
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
                placeholder="Buscar certificado..."
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

      <div className="bg-white rounded-lg shadow-sm">
        <table>
          <thead>
            <tr className="bg-[#09589f]">
              <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                Producto
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                Código
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                Descripción
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                Fecha Emisión
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">
                Fecha Vencimiento
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
            {currentCertificados.map((cert, idx) => (
              <tr
                key={cert.id}
                className={clsx(
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white",
                  "hover:bg-gray-100 transition-colors"
                )}
              >
                <td className="border px-2 py-2 text-center">{cert.id}</td>
                <td className="border px-2 py-2">
                  {productos.find(p => p.id === cert.id_producto)?.producto}
                </td>
                <td className="border px-2 py-2">{cert.codigo}</td>
                <td className="border px-2 py-2">{cert.descripcion}</td>
                <td className="border px-2 py-2">
                  {cert.fecha_emision ? cert.fecha_emision.split("T")[0] : ""}
                </td>
                <td className="border px-2 py-2">
                  {cert.fecha_vencimiento ? cert.fecha_vencimiento.split("T")[0] : ""}
                </td>
                <td className="border px-2 py-2">{cert.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td className="border px-2 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => openModal(cert)}
                    className="bg-yellow-200 text-yellow-800 p-1 rounded hover:bg-yellow-300 shadow-sm"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={() => confirmDelete(cert)}
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
      {showModal && selectedCertificado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-sm font-semibold mb-4">
              {selectedCertificado.id ? "Editar Certificado" : "Nuevo Certificado"}
            </h3>

            {/* Select de Producto */}
            <label className="text-xs font-medium">Producto</label>
            <select
              value={selectedCertificado.id_producto}
              onChange={(e) =>
                setSelectedCertificado({
                  ...selectedCertificado,
                  id_producto: Number(e.target.value),
                })
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
              type="text"
              placeholder="Código"
              value={selectedCertificado.codigo}
              onChange={(e) =>
                setSelectedCertificado({ ...selectedCertificado, codigo: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            <textarea
              placeholder="Descripción"
              value={selectedCertificado.descripcion}
              onChange={(e) =>
                setSelectedCertificado({ ...selectedCertificado, descripcion: e.target.value })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            {/* Fechas solo con día, mes y año */}
            <label className="text-xs font-medium">Fecha Emisión</label>
            <input
              type="date"
              value={selectedCertificado.fecha_emision?.split("T")[0] || ""}
              onChange={(e) =>
                setSelectedCertificado({
                  ...selectedCertificado,
                  fecha_emision: e.target.value,
                })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

                        <label className="text-xs font-medium">Fecha Vencimiento</label>
            <input
              type="date"
              value={selectedCertificado.fecha_vencimiento?.split("T")[0] || ""}
              onChange={(e) =>
                setSelectedCertificado({
                  ...selectedCertificado,
                  fecha_vencimiento: e.target.value,
                })
              }
              className="w-full border px-2 py-1 mb-2 rounded text-sm"
            />

            <select
              value={selectedCertificado.estado}
              onChange={(e) =>
                setSelectedCertificado({
                  ...selectedCertificado,
                  estado: Number(e.target.value),
                })
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
            <h3 className="text-sm font-semibold mb-4 text-red-600">
              ¿Eliminar Certificado?
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

export default Certificados;
