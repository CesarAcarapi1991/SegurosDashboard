import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import { useAuthStore } from "../store/authStore";
import OperacionCliente from "./OperacionCliente";
import OperacionProducto from "./OperacionProducto";

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

const Operaciones: React.FC = () => {
  const { user } = useAuthStore();

  const [operaciones, setOperaciones] = useState<OperacionPayload[]>([]);
  const [selectedOperacion, setSelectedOperacion] = useState<OperacionPayload | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const operacionesPerPage = 5;

  const [operacionPayload, setOperacionPayload] = useState<OperacionPayload>({});

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

  // Paginación
  const indexOfLast = currentPage * operacionesPerPage;
  const indexOfFirst = indexOfLast - operacionesPerPage;
  const currentOperaciones = operaciones.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(operaciones.length / operacionesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex text-xs text-gray-500">
          <li className="flex items-center">
            <span>Dashboard</span>
            <svg className="h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li className="text-gray-700 font-medium">Operaciones</li>
        </ol>
      </nav>

      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Operaciones</h1>
            <p className="text-sm text-gray-600">Gestiona las operaciones de seguros y sus beneficiarios</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Operación
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
            <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
              <option value="">Todos</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o número de póliza..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nro Póliza</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOperaciones.map((op, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{op.nro_poliza}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {op.primernombre} {op.primerapellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.id_seguro_producto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.id_certificado}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      op.estado === 1 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {op.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openModal(op)} className="text-blue-600 hover:text-blue-900">Editar</button>
                    <button className="text-green-600 hover:text-green-900">Beneficiario</button>
                    <button className="text-red-600 hover:text-red-900">Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación mejorada */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{indexOfFirst + 1}</span> a{' '}
                <span className="font-medium">{Math.min(indexOfLast, operaciones.length)}</span> de{' '}
                <span className="font-medium">{operaciones.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={clsx(
                      "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                      currentPage === idx + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal con diseño mejorado */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedOperacion?.nro_poliza ? "Editar Operación" : "Nueva Operación"}
                </h3>
              </div>
              
              <div className="bg-white px-6 py-4 space-y-6">
                <OperacionProducto onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />
                <OperacionCliente onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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