import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import { useAuthStore } from "../store/authStore";
import OperacionCliente from "./OperacionCliente";
import OperacionProducto from "./OperacionProducto";
import { HiSearch, HiPencil, HiPlus } from "react-icons/hi";

interface OperacionPayload {
  nro_poliza?: string;
  id_cliente?: number | null;
  id_seguro_producto?: number | null;
  id_certificado?: number | null;
  primernombre?: string;
  segundonombre?: string;
  primerapellido?: string;
  segundoapellido?: string;
  apellidocasada?: string;
  tipodocumento?: number;
  nrodocumento?: number;
  complemento?: string;
  extension?: number;
  nacionalidad?: number;
  ocupacion?: string;
  fechanacimiento?: string;
  estadocivil?: number;
  fechavencimiento?: string;
  numerocelular?: number;
  peso?: string;
  estatura?: string;
  edad?: string;
  estado?: number;
  usuario_creacion?: string;
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

const Operaciones: React.FC = () => {
  const { user } = useAuthStore();

  const [operaciones, setOperaciones] = useState<OperacionPayload[]>([]);
  const [selectedOperacion, setSelectedOperacion] = useState<OperacionPayload | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const operacionesPerPage = 5;

  const [operacionPayload, setOperacionPayload] = useState<OperacionPayload>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOperaciones();
  }, []);

  const fetchOperaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/operaciones`);
      setOperaciones(res.data);
    } catch (error) {
      console.error("Error al obtener operaciones:", error);
    }
  };

  const openModal = (operacion: OperacionPayload | null = null) => {
    if (operacion) {
      setSelectedOperacion(operacion);
      setOperacionPayload(operacion);
    } else {
      const nuevaOp = {
        estado: 1,
        usuario_creacion: `${user?.nombre} ${user?.apellido}`,
      };
      setSelectedOperacion(nuevaOp);
      setOperacionPayload(nuevaOp);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedOperacion) return;

    const data: OperacionPayload = {
      ...selectedOperacion,
      ...operacionPayload,
    };

    try {
      if (selectedOperacion?.nro_poliza) {
        await axios.put(`${API_URL}/operaciones/${selectedOperacion.nro_poliza}`, data);
      } else {
        await axios.post(`${API_URL}/operaciones`, data);
      }
      setShowModal(false);
      fetchOperaciones();
    } catch (error) {
      console.error("Error al guardar operación:", error);
    }
  };

  // Add search filter
  const filteredOperaciones = operaciones.filter(op =>
    op.nro_poliza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${op.primernombre} ${op.primerapellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * operacionesPerPage;
  const indexOfFirst = indexOfLast - operacionesPerPage;
  const currentOperaciones = filteredOperaciones.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOperaciones.length / operacionesPerPage);

  return (
    <div className="min-h-screen bg-gray-200/50 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Operaciones</h1>
            <p className="text-xs text-gray-500">Gestión de operaciones de seguros</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-200"
            style={{ backgroundColor: colors.secondary.main, color: 'white' }}
          >
            <HiPlus className="h-4 w-4 mr-1.5" />
            Nueva Operación
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
                placeholder="Buscar operación..."
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
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Nro Póliza</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Cliente</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Producto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Estado</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-white tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOperaciones.map((op, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-900">{op.nro_poliza}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {op.primernombre} {op.primerapellido}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{op.id_seguro_producto}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    <span className={clsx(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      op.estado === 1 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {op.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openModal(op)}
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
                        className="inline-flex items-center px-2 py-1 text-xs rounded text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        Beneficiario
                      </button>
                      <button
                        className="inline-flex items-center px-2 py-1 text-xs rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        Cancelar
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
              Mostrando {indexOfFirst + 1} a {Math.min(indexOfLast, operaciones.length)} de {operaciones.length}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium" style={{ color: colors.secondary.main }}>
                  {selectedOperacion?.nro_poliza ? "Editar Operación" : "Nueva Operación"}
                </h3>
              </div>
              
              <div className="p-4 space-y-6">
                <OperacionProducto onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />
                <OperacionCliente onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />
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
    </div>
  );
};

export default Operaciones;