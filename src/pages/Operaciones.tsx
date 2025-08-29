// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import clsx from "clsx";
// // import { useAuthStore } from "../store/authStore";
// // import OperacionCliente from "./OperacionCliente";
// // import OperacionProducto from "./OperacionProducto";

// // interface Cliente {
// //   codigocliente: number;
// //   primernombre: string;
// //   segundonombre?: string;
// //   primerapellido: string;
// //   segundoapellido?: string;
// //   tipodocumento: number;
// //   nrodocumento: number;
// // }

// // interface Producto {
// //   id: number;
// //   empresa_id: number;
// //   empresa: string;
// //   producto: string;
// //   precio: string;
// //   descripcion: string;
// // }

// // interface Certificado {
// //   id: number;
// //   id_producto: number;
// //   codigo: string;
// //   descripcion: string;
// // }

// // interface Operacion {
// //   id?: number;
// //   nro_poliza?: string;
// //   id_cliente?: number;
// //   id_seguro_producto?: number;
// //   id_certificado?: number;
// //   primernombre?: string;
// //   segundonombre?: string;
// //   primerapellido?: string;
// //   segundoapellido?: string;
// //   fechanacimiento?: string;
// //   peso?: number;
// //   estatura?: number;
// //   edad?: number;
// //   estado?: number;
// //   usuario_creacion?: string;
// // }

// // const API_URL = process.env.REACT_APP_API_URL;

// // const Operaciones: React.FC = () => {
// //   const { user } = useAuthStore();

// //   const [operaciones, setOperaciones] = useState<Operacion[]>([]);
// //   const [productos, setProductos] = useState<Producto[]>([]);
// //   const [certificados, setCertificados] = useState<Certificado[]>([]);
// //   const [clientes, setClientes] = useState<Cliente[]>([]);

// //   const [selectedOperacion, setSelectedOperacion] = useState<Operacion | null>(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const operacionesPerPage = 5;

// //   // Cargar datos iniciales
// //   useEffect(() => {
// //     fetchOperaciones();
// //     fetchProductos();
// //     fetchClientes();
// //   }, []);

// //   const fetchOperaciones = async () => {
// //     try {
// //       const res = await axios.get(`${API_URL}/operaciones`);
// //       setOperaciones(res.data);
// //     } catch (error) {
// //       console.error("Error al obtener operaciones:", error);
// //     }
// //   };

// //   const fetchProductos = async () => {
// //     try {
// //       const res = await axios.get(`${API_URL}/productos`);
// //       setProductos(res.data);
// //     } catch (error) {
// //       console.error("Error al obtener productos:", error);
// //     }
// //   };

// //   const fetchCertificados = async (id_producto: number) => {
// //     try {
// //       const res = await axios.get(`${API_URL}/certificados?producto=${id_producto}&estado=1`);
// //       setCertificados(res.data);
// //       if (res.data[0]) {
// //         setSelectedOperacion((prev) => prev ? { ...prev, id_certificado: res.data[0].id } : prev);
// //       }
// //     } catch (error) {
// //       console.error("Error al obtener certificados:", error);
// //     }
// //   };

// //   const fetchClientes = async () => {
// //     try {
// //       const res = await axios.get(`${API_URL}/clientes`);
// //       setClientes(res.data);
// //     } catch (error) {
// //       console.error("Error al obtener clientes:", error);
// //     }
// //   };

// //   // Abrir modal Crear/Editar
// //   const openModal = (operacion: Operacion | null = null) => {
// //     if (operacion) {
// //       setSelectedOperacion(operacion);
// //       if (operacion.id_seguro_producto) fetchCertificados(operacion.id_seguro_producto);
// //     } else {
// //       setSelectedOperacion({
// //         estado: 1,
// //         usuario_creacion: `${user?.nombre} ${user?.apellido}`,
// //       });
// //     }
// //     setShowModal(true);
// //   };

// //   // Guardar operación
// //   const handleSave = async () => {
// //     if (!selectedOperacion) return;
// //     try {
// //       if (selectedOperacion.id) {
// //         await axios.put(`${API_URL}/operaciones/${selectedOperacion.id}`, selectedOperacion);
// //       } else {
// //         await axios.post(`${API_URL}/operaciones`, selectedOperacion);
// //       }
// //       setShowModal(false);
// //       fetchOperaciones();
// //     } catch (error) {
// //       console.error("Error al guardar operación:", error);
// //     }
// //   };

// //   // Paginación
// //   const indexOfLast = currentPage * operacionesPerPage;
// //   const indexOfFirst = indexOfLast - operacionesPerPage;
// //   const currentOperaciones = operaciones.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(operaciones.length / operacionesPerPage);

// //   return (
// //     <div className="p-6">
// //       {/* Header */}
// //       <div className="flex justify-between mb-4 items-center">
// //         <h2 className="text-sm font-semibold text-gray-800">Operaciones</h2>
// //         <button
// //           onClick={() => openModal()}
// //           className="bg-blue-600 text-white px-3 py-1 rounded text-xs shadow hover:bg-blue-700 transition"
// //         >
// //           + Nueva Operación
// //         </button>
// //       </div>

// //       {/* Tabla */}
// //       <div className="overflow-x-auto">
// //         <table className="w-full table-auto border-collapse border border-gray-200 text-sm shadow-lg rounded-md overflow-hidden">
// //           <thead className="bg-gray-900 text-white text-xs uppercase tracking-wide">
// //             <tr>
// //               <th className="border px-2 py-2 text-center">ID</th>
// //               <th className="border px-2 py-2 text-left">Cliente</th>
// //               <th className="border px-2 py-2 text-left">Producto</th>
// //               <th className="border px-2 py-2 text-left">Certificado</th>
// //               <th className="border px-2 py-2 text-left">Estado</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {currentOperaciones.map((op, idx) => (
// //               <tr
// //                 key={op.id}
// //                 className={clsx(idx % 2 === 0 ? "bg-gray-50" : "bg-white", "hover:bg-gray-100 transition-colors")}
// //               >
// //                 <td className="border px-2 py-2 text-center">{op.id}</td>
// //                 <td className="border px-2 py-2">
// //                   {clientes.find(c => c.codigocliente === op.id_cliente)?.primernombre}{" "}
// //                   {clientes.find(c => c.codigocliente === op.id_cliente)?.primerapellido}
// //                 </td>
// //                 <td className="border px-2 py-2">
// //                   {productos.find(p => p.id === op.id_seguro_producto)?.producto}
// //                 </td>
// //                 <td className="border px-2 py-2">
// //                   {certificados.find(c => c.id === op.id_certificado)?.codigo}
// //                 </td>
// //                 <td className="border px-2 py-2">{op.estado === 1 ? "Activo" : "Inactivo"}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Paginación */}
// //       <div className="flex justify-center mt-4 space-x-2">
// //         {Array.from({ length: totalPages }, (_, idx) => (
// //           <button
// //             key={idx + 1}
// //             onClick={() => setCurrentPage(idx + 1)}
// //             className={clsx(
// //               "px-2 py-1 rounded text-xs border shadow-sm",
// //               currentPage === idx + 1 ? "bg-blue-600  text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"
// //             )}
// //           >
// //             {idx + 1}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Modal Crear/Editar */}
// //       {showModal && selectedOperacion && (
// //         <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-40 z-50 pt-10 overflow-y-auto">
// //           <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-6xl space-y-4">
// //             <h3 className="text-sm font-semibold mb-4">{selectedOperacion.id ? "Editar Operación" : "Nueva Operación"}</h3>

// //             <OperacionProducto />
// //             <OperacionCliente />

// //             {/* Botones */}
// //             <div className="flex justify-end space-x-2">
// //               <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">Cancelar</button>
// //               <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Guardar</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Operaciones;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import clsx from "clsx";
// import { useAuthStore } from "../store/authStore";
// import OperacionCliente from "./OperacionCliente";
// import OperacionProducto from "./OperacionProducto";

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

// const Operaciones: React.FC = () => {
//   const { user } = useAuthStore();

//   const [operaciones, setOperaciones] = useState<OperacionPayload[]>([]);
//   const [selectedOperacion, setSelectedOperacion] = useState<OperacionPayload | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const operacionesPerPage = 5;

//   const [operacionPayload, setOperacionPayload] = useState<OperacionPayload>({});

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

//   // Paginación
//   const indexOfLast = currentPage * operacionesPerPage;
//   const indexOfFirst = indexOfLast - operacionesPerPage;
//   const currentOperaciones = operaciones.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(operaciones.length / operacionesPerPage);

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between mb-4 items-center">
//         <h2 className="text-sm font-semibold text-gray-800">Operaciones</h2>
//         <button
//           onClick={() => openModal()}
//           className="bg-blue-600 text-white px-3 py-1 rounded text-xs shadow hover:bg-blue-700 transition"
//         >
//           + Nueva Operación
//         </button>
//       </div>

//       {/* Tabla */}
//       <div className="overflow-x-auto">
//         <table className="w-full table-auto border-collapse border border-gray-200 text-sm shadow-lg rounded-md overflow-hidden">
//           <thead className="bg-gray-900 text-white text-xs uppercase tracking-wide">
//             <tr>
//               <th className="border px-2 py-2 text-center">Nro Póliza</th>
//               <th className="border px-2 py-2 text-left">Cliente</th>
//               <th className="border px-2 py-2 text-left">Producto</th>
//               <th className="border px-2 py-2 text-left">Certificado</th>
//               <th className="border px-2 py-2 text-left">Estado</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentOperaciones.map((op, idx) => (
//               <tr
//                 key={idx}
//                 className={clsx(idx % 2 === 0 ? "bg-gray-50" : "bg-white", "hover:bg-gray-100 transition-colors")}
//               >
//                 <td className="border px-2 py-2 text-center">{op.nro_poliza}</td>
//                 <td className="border px-2 py-2">
//                   {op.primernombre} {op.primerapellido}
//                 </td>
//                 <td className="border px-2 py-2">{op.id_seguro_producto}</td>
//                 <td className="border px-2 py-2">{op.id_certificado}</td>
//                 <td className="border px-2 py-2">{op.estado === 1 ? "Activo" : "Inactivo"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Paginación */}
//       <div className="flex justify-center mt-4 space-x-2">
//         {Array.from({ length: totalPages }, (_, idx) => (
//           <button
//             key={idx + 1}
//             onClick={() => setCurrentPage(idx + 1)}
//             className={clsx(
//               "px-2 py-1 rounded text-xs border shadow-sm",
//               currentPage === idx + 1 ? "bg-blue-600  text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"
//             )}
//           >
//             {idx + 1}
//           </button>
//         ))}
//       </div>

//       {/* Modal Crear/Editar */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-40 z-50 pt-10 overflow-y-auto">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-6xl space-y-4">
//             <h3 className="text-sm font-semibold mb-4">{selectedOperacion?.nro_poliza ? "Editar Operación" : "Nueva Operación"}</h3>

//             <OperacionProducto onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />
//             <OperacionCliente onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))} />

//             {/* Botones */}
//             <div className="flex justify-end space-x-2">
//               <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">Cancelar</button>
//               <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Guardar</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Operaciones;


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

interface Producto {
  id: number;
  nombre: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const Operaciones: React.FC = () => {
  const { user } = useAuthStore();

  const [operaciones, setOperaciones] = useState<OperacionPayload[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedOperacion, setSelectedOperacion] = useState<OperacionPayload | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const operacionesPerPage = 5;

  const [operacionPayload, setOperacionPayload] = useState<OperacionPayload>({});

  useEffect(() => {
    fetchOperaciones();
    fetchProductos();
  }, []);

  const fetchOperaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/operaciones`);
      setOperaciones(res.data);
    } catch (error) {
      console.error("Error al obtener operaciones:", error);
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

  const getProductoNombre = (id: number | null | undefined) => {
    const producto = productos.find((p) => p.id === id);
    return producto ? producto.nombre : "-";
  };

  // Paginación
  const indexOfLast = currentPage * operacionesPerPage;
  const indexOfFirst = indexOfLast - operacionesPerPage;
  const currentOperaciones = operaciones.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(operaciones.length / operacionesPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-sm font-semibold text-gray-800">Operaciones</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs shadow hover:bg-blue-700 transition"
        >
          + Nueva Operación
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 text-sm shadow-lg rounded-md overflow-hidden">
          <thead className="bg-gray-900 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="border px-2 py-2 text-center">Nro Póliza</th>
              <th className="border px-2 py-2 text-left">Cliente</th>
              <th className="border px-2 py-2 text-left">Producto</th>
              <th className="border px-2 py-2 text-left">Nro Documento</th>
              <th className="border px-2 py-2 text-left">Estado</th>
              <th className="border px-2 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentOperaciones.map((op, idx) => (
              <tr
                key={idx}
                className={clsx(idx % 2 === 0 ? "bg-gray-50" : "bg-white", "hover:bg-gray-100 transition-colors")}
              >
                <td className="border px-2 py-2 text-center">{op.nro_poliza}</td>
                <td className="border px-2 py-2">{op.primernombre} {op.primerapellido}</td>
                <td className="border px-2 py-2">{getProductoNombre(op.id_seguro_producto)}</td>
                <td className="border px-2 py-2">{op.nrodocumento}</td>
                <td className="border px-2 py-2">{op.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td className="border px-2 py-2 space-x-2">
                  <button
                    onClick={() => openModal(op)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => console.log("Beneficiario", op)}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    Beneficiario
                  </button>
                  <button
                    onClick={() => console.log("Cancelar", op)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Cancelar
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
              currentPage === idx + 1 ? "bg-blue-600  text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-40 z-50 pt-10 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-6xl space-y-4">
            <h3 className="text-sm font-semibold mb-4">{selectedOperacion?.nro_poliza ? "Editar Operación" : "Nueva Operación"}</h3>

            <OperacionProducto
              onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))}
            />
            <OperacionCliente
              onChange={(data) => setOperacionPayload((prev) => ({ ...prev, ...data }))}
            />

            {/* Botones */}
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
    </div>
  );
};

export default Operaciones;
