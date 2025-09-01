// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import clsx from "clsx";
// import { useAuthStore } from "../store/authStore";
// import OperacionCliente from "./OperacionCliente";
// import OperacionProducto from "./OperacionProducto";
// import { HiSearch, HiPencil, HiPlus } from "react-icons/hi";

// interface OperacionPayload {
//   nro_poliza?: string;
//   id_cliente?: number | null;
//   id_seguro_producto?: number | null;
//   id_certificado?: number | null;
//   primernombre?: string;
//   segundonombre?: string;
//   primerapellido?: string;
//   segundoapellido?: string;
//   apellidocasada?: string;
//   tipodocumento?: number;
//   nrodocumento?: number;
//   complemento?: string;
//   extension?: number;
//   nacionalidad?: number;
//   ocupacion?: string;
//   fechanacimiento?: string;
//   estadocivil?: number;
//   fechavencimiento?: string;
//   numerocelular?: number;
//   peso?: string;
//   estatura?: string;
//   edad?: string;
//   estado?: number;
//   usuario_creacion?: string;
// }

// const API_URL = process.env.REACT_APP_API_URL;

// const colors = {
//   primary: {
//     main: '#0097a6',
//     light: '#00adc0',
//     dark: '#007d8a',
//     bg: 'rgba(0, 151, 166, 0.1)',
//   },
//   secondary: {
//     main: '#09589f',
//     light: '#0a69bd',
//     dark: '#074781',
//     bg: 'rgba(9, 88, 159, 0.1)',
//   },
//   gray: {
//     main: '#374151',
//     light: '#e5e7eb',
//     bg: 'rgba(55, 65, 81, 0.05)',
//   }
// };

// const Operaciones: React.FC = () => {
//   const { user } = useAuthStore();

//   const [operaciones, setOperaciones] = useState<OperacionPayload[]>([]);
//   const [selectedOperacion, setSelectedOperacion] = useState<OperacionPayload | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const operacionesPerPage = 5;

//   const [operacionPayload, setOperacionPayload] = useState<OperacionPayload>({});
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchOperaciones();
//   }, []);

//   const fetchOperaciones = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/operaciones`);
//       setOperaciones(res.data);
//     } catch (error) {
//       console.error("Error al obtener operaciones:", error);
//     }
//   };

//   const openModal = (operacion: OperacionPayload | null = null) => {
//     if (operacion) {
//       setSelectedOperacion(operacion);
//       setOperacionPayload(operacion);
//     } else {
//       const nuevaOp = {
//         estado: 1,
//         usuario_creacion: `${user?.nombre} ${user?.apellido}`,
//       };
//       setSelectedOperacion(nuevaOp);
//       setOperacionPayload(nuevaOp);
//     }
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!selectedOperacion) return;

//     const data: OperacionPayload = {
//       ...selectedOperacion,
//       ...operacionPayload,
//     };

//     try {
//       if (selectedOperacion?.nro_poliza) {
//         await axios.put(`${API_URL}/operaciones/${selectedOperacion.nro_poliza}`, data);
//       } else {
//         await axios.post(`${API_URL}/operaciones`, data);
//       }
//       setShowModal(false);
//       fetchOperaciones();
//     } catch (error) {
//       console.error("Error al guardar operación:", error);
//     }
//   };

//   // Add search filter
//   const filteredOperaciones = operaciones.filter(op =>
//     op.nro_poliza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     `${op.primernombre} ${op.primerapellido}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Paginación
//   const indexOfLast = currentPage * operacionesPerPage;
//   const indexOfFirst = indexOfLast - operacionesPerPage;
//   const currentOperaciones = filteredOperaciones.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredOperaciones.length / operacionesPerPage);

//   return (
//     <div className="min-h-screen bg-gray-200/50 p-4">
//       {/* Header Section */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1 className="text-xl font-semibold text-gray-800">Operaciones</h1>
//             <p className="text-xs text-gray-500">Gestión de operaciones de seguros</p>
//           </div>
//           <button
//             onClick={() => openModal()}
//             className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-200"
//             style={{ backgroundColor: colors.secondary.main, color: 'white' }}
//           >
//             <HiPlus className="h-4 w-4 mr-1.5" />
//             Nueva Operación
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="flex">
//           <div className="w-full max-w-xs">
//             <div className="relative">
//               <HiSearch className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Buscar operación..."
//                 className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:ring-1 focus:ring-opacity-50"
//                 style={{ '--tw-ring-color': colors.secondary.main } as React.CSSProperties}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr className="bg-[#09589f]">
//                 <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Nro Póliza</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Cliente</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Producto</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Estado</th>
//                 <th className="px-4 py-2 text-center text-xs font-medium text-white tracking-wider">Acciones</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentOperaciones.map((op, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 text-xs text-gray-900">{op.nro_poliza}</td>
//                   <td className="px-4 py-2 text-xs text-gray-600">
//                     {op.primernombre} {op.primerapellido}
//                   </td>
//                   <td className="px-4 py-2 text-xs text-gray-600">{op.id_seguro_producto}</td>
//                   <td className="px-4 py-2 text-xs text-gray-600">
//                     <span className={clsx(
//                       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
//                       op.estado === 1 
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     )}>
//                       {op.estado === 1 ? "Activo" : "Inactivo"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-center">
//                     <div className="flex justify-center space-x-2">
//                       <button
//                         onClick={() => openModal(op)}
//                         className="inline-flex items-center px-2 py-1 text-xs rounded transition-colors"
//                         style={{
//                           color: colors.secondary.main,
//                           backgroundColor: colors.secondary.bg,
//                         }}
//                       >
//                         <HiPencil className="h-3 w-3 mr-1" />
//                         Editar
//                       </button>
//                       <button
//                         className="inline-flex items-center px-2 py-1 text-xs rounded text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
//                       >
//                         Beneficiario
//                       </button>
//                       <button
//                         className="inline-flex items-center px-2 py-1 text-xs rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
//                       >
//                         Cancelar
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="px-4 py-3 border-t border-gray-200">
//           <div className="flex items-center justify-between">
//             <p className="text-xs text-gray-500">
//               Mostrando {indexOfFirst + 1} a {Math.min(indexOfLast, operaciones.length)} de {operaciones.length}
//             </p>
//             <nav className="flex space-x-1">
//               {Array.from({ length: totalPages }, (_, idx) => (
//                 <button
//                   key={idx + 1}
//                   onClick={() => setCurrentPage(idx + 1)}
//                   className={clsx(
//                     "px-2.5 py-1 text-xs font-medium rounded transition-colors",
//                     currentPage === idx + 1
//                       ? "text-white"
//                       : "text-gray-500 hover:bg-gray-100"
//                   )}
//                   style={
//                     currentPage === idx + 1 
//                       ? { backgroundColor: colors.secondary.main }
//                       : undefined
//                   }
//                 >
//                   {idx + 1}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
//             <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl">
//               <div className="px-4 py-3 border-b border-gray-200">
//                 <h3 className="text-sm font-medium" style={{ color: colors.secondary.main }}>
//                   {selectedOperacion?.nro_poliza ? "Editar Operación" : "Nueva Operación"}
//                 </h3>
//               </div>

//               <div className="p-4 space-y-6">
//                 <OperacionProducto onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />
//                 <OperacionCliente onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />
//               </div>

//               <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded"
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="px-3 py-1.5 text-xs font-medium text-white rounded"
//                   style={{ backgroundColor: colors.secondary.main }}
//                 >
//                   Guardar
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Operaciones;

import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import axios from "axios";
import clsx from "clsx";
import { useAuthStore } from "../store/authStore";
import { HiSearch, HiPencil, HiPlus } from "react-icons/hi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Divider } from "@mui/material";

interface OperacionPayload {
  id?: number;
  nro_poliza?: string;
  id_cliente?: number;
  nombre_completo?: string;
  tipo_documento?: string;
  nro_documento?: string;
  fechanacimiento?: string;
  fecha_creacion?: string;
  fechavigencia?: string;
  estado_civil?: string;
  id_seguro_producto?: number;
  estado?: number|string;
  producto?: string;
  precio?: string;
  empresa?: string;
  usuario_creacion?: string;
  usuario_modificacion?: string;
  estado_operacion?: number;
}

interface Producto {
  id: number;
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
  nombre_empresa: string;
}

interface Cliente {
  codigocliente: number;
  primernombre: string;
  segundonombre?: string;
  primerapellido: string;
  segundoapellido?: string;
  apellidocasada?: string;
  tipodocumento: number;
  nrodocumento: number;
  complemento?: string;
  extension?: number;
  nacionalidad?: number;
  ocupacion?: string;
  fechanacimiento: string;
  estadocivil?: number;
  fechavencimiento?: string;
  numerocelular?: number;
  correoelectronico?: string;
  nombre_completo: string;
  nro_documento_desc: string;
  estado_civil_desc?: string;
  tipo_documento_desc?: string;
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

  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  const productoOptions = productos.map(c => ({
    value: c.id,
    label: `${c.producto}`,
  }));
  const handleSelectProducto = (
    option: SingleValue<{ value: number; label: string }>
  ) => {
    if (option) {
      const producto = productos.find(c => c.id === option.value) || null;
      setSelectedProducto(producto);

      // Aquí actualizamos la operación con la info del cliente
      setSelectedOperacion(prev => ({
        ...prev,
        id_seguro_producto: producto?.id,
        producto: producto?.producto,
        precio: producto?.precio,
        empresa: producto?.nombre_empresa,
      }));

    } else {
      setSelectedProducto(null);
      setSelectedOperacion(prev => ({
        ...prev,
        id_seguro_producto: undefined,
        producto: undefined,
        precio: undefined,
        empresa: undefined,
      }));
    }
  };

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const clienteOptions = clientes.map(c => ({
    value: c.codigocliente,
    label: `${c.nrodocumento} - ${c.primernombre} ${c.primerapellido}`,
  }));

  const handleSelectCliente = (
    option: SingleValue<{ value: number; label: string }>
  ) => {
    if (option) {
      const cliente = clientes.find(c => c.codigocliente === option.value) || null;
      setSelectedCliente(cliente);

      // Aquí actualizamos la operación con la info del cliente
      setSelectedOperacion(prev => ({
        ...prev,
        id_cliente: cliente?.codigocliente,
        nombre_completo: cliente?.nombre_completo,
        nro_documento: cliente?.nro_documento_desc,
        tipo_documento: cliente?.tipo_documento_desc,
        fechanacimiento: cliente?.fechanacimiento,
        estado_civil: cliente?.estado_civil_desc,
      }));

    } else {
      setSelectedCliente(null);
      setSelectedOperacion(prev => ({
        ...prev,
        id_cliente: undefined,
        nombre_completo: undefined,
        nro_documento: undefined,
        fechanacimiento: undefined,
        estadocivil: undefined,
      }));
    }
  };

  //#region beneficiario
  const [showBeneficiarioModal, setShowBeneficiarioModal] = useState(false);
  const [beneficiarios, setBeneficiarios] = useState<any[]>([]);
  const [operacionActual, setOperacionActual] = useState<OperacionPayload | null>(null);

  const openBeneficiarioModal = (operacion: OperacionPayload) => {
    setOperacionActual(operacion);
    setShowBeneficiarioModal(true);

    // opcional: traer beneficiarios ya guardados en BD
    //fetchBeneficiarios(operacion.id_seguro_producto);
  };

  const fetchBeneficiarios = async (idProducto?: number) => {
    if (!idProducto) return;
    try {
      const res = await axios.get(`${API_URL}/beneficiarios/${idProducto}`);
      setBeneficiarios(res.data);
    } catch (error) {
      console.error("Error al obtener beneficiarios:", error);
    }
  };

  const handleAddBeneficiario = () => {
    setBeneficiarios([...beneficiarios, { nombre: "", documento: "", parentesco: "" }]);
  };

  const handleChangeBeneficiario = (index: number, field: string, value: string) => {
    const newBeneficiarios = [...beneficiarios];
    newBeneficiarios[index][field] = value;
    setBeneficiarios(newBeneficiarios);
  };

  const handleRemoveBeneficiario = (index: number) => {
    setBeneficiarios(beneficiarios.filter((_, i) => i !== index));
  };

  const handleSaveBeneficiarios = async () => {
    if (!operacionActual?.id_seguro_producto) return;
    try {
      await axios.post(`${API_URL}/beneficiarios/${operacionActual.id_seguro_producto}`, beneficiarios);
      setShowBeneficiarioModal(false);
    } catch (error) {
      console.error("Error al guardar beneficiarios:", error);
    }
  };

  //#endregion


  const [selectedOperacion, setSelectedOperacion] = useState<OperacionPayload | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const operacionesPerPage = 10;

  const [operacionPayload, setOperacionPayload] = useState<OperacionPayload>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Filtros nuevos
  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  // Formatear a YYYY-MM-DD para input type="date"
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [fechaDesde, setFechaDesde] = useState(formatDate(haceUnaSemana));
  const [fechaHasta, setFechaHasta] = useState(formatDate(hoy));

  const [estadoFiltro, setEstadoFiltro] = useState("0");

  useEffect(() => {
    fetchOperaciones();
    fetchClientes();
    fetchProductos();
  }, []);

  const generarPDF = (op: OperacionPayload) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text("Detalle de Operación", 14, 20);

    // Información de la operación
    doc.setFontSize(12);
    doc.text(`Nro Póliza: ${op.nro_poliza || "-"}`, 14, 30);
    doc.text(`Cliente: ${op.nombre_completo || "-"}`, 14, 38);
    doc.text(`Producto: ${op.producto || "-"}`, 14, 46);
    doc.text(`Estado: ${op.estado === 1 ? "Activo" : "Inactivo"}`, 14, 54);

    // Guardar PDF
    doc.save(`Operacion_${op.nro_poliza || "sin_numero"}.pdf`);
  };


  const fetchOperaciones = async () => {
    try {
      const params = new URLSearchParams();
      if (fechaDesde) params.append("fecha_desde", fechaDesde);
      if (fechaHasta) params.append("fecha_hasta", fechaHasta);
      if (estadoFiltro) params.append("estado", estadoFiltro);

      const res = await axios.get(`${API_URL}/operaciones/filtrar?${params.toString()}`);
      setOperaciones(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener operaciones:", error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await axios.get(`${API_URL}/clientes`);
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
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

  const openModal = (operacion: OperacionPayload | null = null) => {
    if (operacion) {
      setSelectedOperacion(operacion);
      setOperacionPayload(operacion);
    } else {
      const nuevaOp: OperacionPayload = {
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



  // Filtro de búsqueda por póliza o cliente
  const filteredOperaciones = operaciones.filter(op =>
    op.nro_poliza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${op.nombre_completo} ${op.nro_documento}`.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500">Fecha Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-md"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Fecha Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-md"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Estado</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-md"
            >
              <option value="0">Todos</option>
              <option value="1">Generado</option>
              <option value="2">Vigente</option>
              <option value="3">Cancelado</option>
              <option value="4">Vencido</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchOperaciones}
              className="px-3 py-1.5 text-xs font-medium text-white rounded"
              style={{ backgroundColor: colors.secondary.main }}
            >
              Listar
            </button>
          </div>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Nro Solicitud</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Nro Póliza</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Estado</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Cliente</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Documento Identidad</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Fecha Nacimiento</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-white tracking-wider">Producto</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-white tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOperaciones.map((op, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-900">{op.id}</td>
                  <td className="px-4 py-2 text-xs text-gray-900">{op.nro_poliza}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    <span className={clsx(
                      "inline-flex items-center px-2 py-1 text-xs rounded transition-colors",
                      op.estado_operacion === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    )}>
                      {op.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {op.nombre_completo}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{op.nro_documento}</td>
                  {/* <td className="px-4 py-2 text-xs text-gray-600">{op.fechanacimiento?.substring(0,10)}</td> */}
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {op.fechanacimiento
                      ? new Date(op.fechanacimiento).toLocaleDateString("es-BO")
                      : ""}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{op.producto}</td>
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
                        onClick={() => openBeneficiarioModal(op)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        Beneficiario
                      </button>
                      <button
                        onClick={() => generarPDF(op)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        PDF
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
      {showModal && selectedOperacion && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium" style={{ color: colors.secondary.main }}>
                  {selectedOperacion?.id ? "Editar Operación" : "Nueva Operación"}
                </h3>
              </div>

              <div className="p-4 space-y-6">

                {selectedOperacion?.id ?
                  <div className="bg-gray-200 p-3 rounded-lg">
                    <span className="block px-4 text-gray-400 text-medium" style={{ color: colors.primary.dark }}>
                      <strong>Información del Solicitud del Seguro </strong>
                    </span>
                    <Divider></Divider>
                    <div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <span className="block text-gray-500 text-xs">Numero Poliza:</span>
                          <span className="text-xs px-5">{selectedOperacion.id_cliente || 'No registrado'}</span>
                          <span className={clsx(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            selectedOperacion.estado === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-600 text-white"
                          )}>
                            {selectedOperacion.estado === 1 ? "Vigente" : "Generado"}
                          </span>
                        </div>
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <span className="block text-gray-500 text-xs">Fecha Solicitud:</span>
                          <span className="text-xs px-5">{selectedOperacion.fecha_creacion?.toString().substring(0, 10) || 'No registrado'}</span>
                        </div>
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <span className="block text-gray-500 text-xs">Fecha Vigencia:</span>
                          <span className="text-xs px-5">{selectedOperacion.fechavigencia?.toString() === 'S/D' ? selectedOperacion.fechavigencia : selectedOperacion.fechavigencia?.toString().substring(0, 10)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                    <div className="max-w-3xl">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Operación Cliente</h2>
                      <p className="text-sm text-gray-500">Complete la información del cliente para continuar</p>

                      {/* Buscador mejorado */}
                      <div className="mt-0">
                        <Select
                          options={clienteOptions}
                          onChange={handleSelectCliente}
                          placeholder="🔍 Buscar cliente por documento o nombre"
                          isClearable
                          className="text-sm"
                          classNamePrefix="select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '2.5rem',
                              boxShadow: 'none',
                              borderColor: '#e5e7eb',
                              '&:hover': {
                                borderColor: '#09589f'
                              }
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                }

                {selectedOperacion?.id_cliente && (
                  <div className="bg-gray-200 p-3 rounded-lg">
                    <span
                      className="block px-4 text-gray-400 text-medium"
                      style={{ color: colors.primary.dark }}
                    >
                      <strong>Información del cliente</strong>
                    </span>
                    <Divider />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs">Codigo Cliente:</span>
                        <span className="text-xs px-5">
                          {selectedOperacion?.id_cliente || "No registrado"}
                        </span>
                      </div>
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs">Nombre Cliente:</span>
                        <span className="text-xs px-5">
                          {selectedOperacion?.nombre_completo || "No registrado"}
                        </span>
                      </div>
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs">Tipo Documento:</span>
                        <span className="text-xs px-5">
                          {selectedOperacion?.tipo_documento ?? "No registrado"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs">Numero Documento:</span>
                        <span className="text-xs px-5">
                          {selectedOperacion?.nro_documento || "No registrado"}
                        </span>
                      </div>
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs">Fecha Nacimiento:</span>
                        <span className="text-xs px-5">
                          {selectedOperacion?.fechanacimiento
                            ? new Date(selectedOperacion.fechanacimiento).toLocaleDateString("es-BO")
                            : "No registrado"}
                        </span>
                      </div>
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <span className="block text-gray-500 text-xs">Estado Civil:</span>
                        <span className="text-xs px-5">
                          {selectedOperacion?.estado_civil || "No registrado"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}



                {/* {selectedOperacion?.id_seguro_producto ?
                  "" :
                  
                } */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                    <div className="max-w-3xl">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">PRODUCTO</h2>
                      <p className="text-sm text-gray-500">Complete la información del cliente para continuar</p>

                      {/* Buscador mejorado */}
                      <div className="mt-0">
                        <Select
                          options={productoOptions}
                          onChange={handleSelectProducto}
                          placeholder="🔍 Buscar producto"
                          isClearable
                          className="text-sm"
                          classNamePrefix="select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '2.5rem',
                              boxShadow: 'none',
                              borderColor: '#e5e7eb',
                              '&:hover': {
                                borderColor: '#09589f'
                              }
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>



                {selectedOperacion?.id_seguro_producto && (
                  <div className="bg-gray-200 p-3 rounded-lg">
                    <span className="block px-4 text-gray-400 text-medium" style={{ color: colors.primary.dark }}><strong>Información del Producto</strong></span>
                    <Divider></Divider>
                    <div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <span className="block text-gray-500 text-xs">Producto:</span>
                          <span className="text-xs px-5">{selectedOperacion.producto || 'No registrado'}</span>
                        </div>
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <span className="block text-gray-500 text-xs">Empresa:</span>
                          <span className="text-xs px-5">{selectedOperacion.empresa}</span>
                        </div>
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <span className="block text-gray-500 text-xs">Precio Seguro:</span>
                          <span className="text-xs px-5">Bs.- {selectedOperacion.precio || 'No registrado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

      {showBeneficiarioModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowBeneficiarioModal(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">
                  Beneficiarios del producto #{operacionActual?.id_seguro_producto}
                </h3>
              </div>

              <div className="p-4">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-xs">Nombre</th>
                      <th className="px-3 py-2 text-xs">Documento</th>
                      <th className="px-3 py-2 text-xs">Parentesco</th>
                      <th className="px-3 py-2 text-xs">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiarios.map((b, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={b.nombre}
                            onChange={(e) => handleChangeBeneficiario(idx, "nombre", e.target.value)}
                            className="border px-2 py-1 text-xs rounded w-full"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={b.documento}
                            onChange={(e) => handleChangeBeneficiario(idx, "documento", e.target.value)}
                            className="border px-2 py-1 text-xs rounded w-full"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={b.parentesco}
                            onChange={(e) => handleChangeBeneficiario(idx, "parentesco", e.target.value)}
                            className="border px-2 py-1 text-xs rounded w-full"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleRemoveBeneficiario(idx)}
                            className="text-red-600 text-xs"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  onClick={handleAddBeneficiario}
                  className="mt-2 px-3 py-1 text-xs bg-green-500 text-white rounded"
                >
                  + Agregar Beneficiario
                </button>
              </div>

              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
                <button
                  onClick={() => setShowBeneficiarioModal(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveBeneficiarios}
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
