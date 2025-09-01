// import React, { useMemo, useState } from "react";
// import { HiCash, HiCreditCard, HiSelector, HiCheckCircle, HiUser, HiReceiptRefund } from "react-icons/hi";

// // Paleta usada en tus otras pantallas
// const colors = {
//   primary: {
//     main: "#0097a6",
//     light: "#00adc0",
//     dark: "#007d8a",
//     bg: "rgba(0, 151, 166, 0.08)",
//   },
//   secondary: {
//     main: "#09589f",
//     light: "#0a69bd",
//     dark: "#074781",
//     bg: "rgba(9, 88, 159, 0.08)",
//   },
//   gray: {
//     main: "#374151",
//     light: "#e5e7eb",
//     bg: "rgba(55, 65, 81, 0.05)",
//   },
// };

// // Tipos de pago
// type Metodo = "caja" | "debito";

// type Item = {
//   id: number;
//   nombre: string;
//   cantidad: number;
//   precio: number; // Bs
// };

// export default function Cobro() {
//   const [metodo, setMetodo] = useState<Metodo>("caja");

//   // Datos simulados para el diseño
//   const [cliente] = useState({
//     documento: "6789123 LP",
//     nombre: "María Fernanda López",
//   });

//   const [items] = useState<Item[]>([
//     { id: 1, nombre: "Seguro Maternidad – Plan A", cantidad: 1, precio: 280.0 },
//     { id: 2, nombre: "Certificado adicional", cantidad: 1, precio: 40.0 },
//   ]);

//   const subtotal = useMemo(
//     () => items.reduce((acc, it) => acc + it.precio * it.cantidad, 0),
//     [items]
//   );
//   const descuento = 0; // solo diseño
//   const total = subtotal - descuento;

//   // Campos específicos por método (solo UI)
//   const [montoRecibido, setMontoRecibido] = useState<string>(""); // caja
//   const cambio = useMemo(() => {
//     const val = parseFloat(montoRecibido || "0");
//     if (Number.isNaN(val)) return 0;
//     return Math.max(val - total, 0);
//   }, [montoRecibido, total]);

//   const [banco, setBanco] = useState("");
//   const [cta, setCta] = useState("");
//   const [autorizacion, setAutorizacion] = useState("");

//   return (
//     <div className="min-h-screen bg-gray-200 p-4">

//       {/* Encabezado */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-gray-800">Cobro</h1>
//             <p className="text-xs text-gray-500">Registro de pago por caja o débito</p>
//           </div>
//           <div className="inline-flex rounded-xl overflow-hidden border border-gray-200">
//             <button
//               onClick={() => setMetodo("caja")}
//               className={`px-3 py-2 text-xs font-medium flex items-center gap-1 ${metodo === "caja"
//                 ? "text-white"
//                 : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               style={metodo === "caja" ? { backgroundColor: colors.secondary.main } : {}}
//             >
//               <HiCash className="h-4 w-4" /> Caja
//             </button>
//             <button
//               onClick={() => setMetodo("debito")}
//               className={`px-3 py-2 text-xs font-medium flex items-center gap-1 border-l border-gray-200 ${metodo === "debito"
//                 ? "text-white"
//                 : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               style={metodo === "debito" ? { backgroundColor: colors.secondary.main } : {}}
//             >
//               <HiCreditCard className="h-4 w-4" /> Débito
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Contenido */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//         {/* Columna izquierda: detalle */}
//         <div className="xl:col-span-2 space-y-4">


//           <div className="bg-white rounded-lg shadow-sm p-2 mb-3">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
//               <div className="flex items-center w-full lg:w-auto gap-2">
//                 <label className="text-[11px] text-gray-500 whitespace-nowrap">
//                   Buscar cliente:
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Documento, nombre o código"
//                   className="flex-1 lg:w-60 px-2 py-1 text-xs border rounded focus:ring-1 focus:outline-none"
//                 />
//                 <button
//                   className="px-3 py-1 text-xs text-white rounded flex items-center gap-1"
//                   style={{ backgroundColor: colors.primary.main }}
//                 >
//                   Buscar
//                 </button>
//               </div>
//             </div>
//           </div>


//           {/* Cliente */}
//           <div className="bg-white rounded-lg shadow-sm p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary.bg }}>
//                 <HiUser className="h-4 w-4" style={{ color: colors.primary.dark }} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Cliente</p>
//                 <p className="text-sm font-medium text-gray-800">{cliente.nombre}</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
//               <div className="bg-gray-50 rounded-md p-2">
//                 <p className="text-gray-500">Documento</p>
//                 <p className="text-gray-900">{cliente.documento}</p>
//               </div>
//               <div className="bg-gray-50 rounded-md p-2">
//                 <p className="text-gray-500">Fecha</p>
//                 <p className="text-gray-900">{new Date().toLocaleDateString("es-BO")}</p>
//               </div>
//               <div className="bg-gray-50 rounded-md p-2">
//                 <p className="text-gray-500">Atiende</p>
//                 <p className="text-gray-900">Usuario actual</p>
//               </div>
//             </div>
//           </div>

//           {/* Items */}
//           <div className="bg-white rounded-lg shadow-sm p-4">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-sm font-medium text-gray-800">Detalle</h3>
//               <button className="text-xs px-2 py-1 rounded-md border border-gray-200 inline-flex items-center gap-1 hover:bg-gray-50">
//                 <HiSelector className="h-4 w-4" />
//                 Gestionar ítems
//               </button>
//             </div>

//             <div className="overflow-hidden rounded-lg border border-gray-200">
//               <table className="w-full text-xs">
//                 <thead className="bg-gray-50 text-gray-600">
//                   <tr>
//                     <th className="text-left px-3 py-2">Concepto</th>
//                     <th className="text-center px-3 py-2">Cant.</th>
//                     <th className="text-right px-3 py-2">Precio (Bs)</th>
//                     <th className="text-right px-3 py-2">Importe (Bs)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {items.map((it) => (
//                     <tr key={it.id} className="border-t">
//                       <td className="px-3 py-2 text-gray-800">{it.nombre}</td>
//                       <td className="px-3 py-2 text-center">{it.cantidad}</td>
//                       <td className="px-3 py-2 text-right">{it.precio.toFixed(2)}</td>
//                       <td className="px-3 py-2 text-right">{(it.precio * it.cantidad).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex justify-end mt-3">
//               <div className="w-full sm:w-80 space-y-1 text-sm">
//                 <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{subtotal.toFixed(2)}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-500">Descuento</span><span className="font-medium">{descuento.toFixed(2)}</span></div>
//                 <div className="flex justify-between text-gray-800 text-base">
//                   <span className="font-semibold">Total</span>
//                   <span className="font-bold">{total.toFixed(2)} Bs</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Columna derecha: método de pago */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-lg shadow-sm p-4">
//             <h3 className="text-sm font-medium text-gray-800 mb-3">Método de pago</h3>

//             {/* Pago por Caja */}
//             {metodo === "caja" && (
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-xs text-gray-500">Monto recibido (Bs)</label>
//                   <input
//                     value={montoRecibido}
//                     onChange={(e) => setMontoRecibido(e.target.value)}
//                     type="number"
//                     min={0}
//                     placeholder="0.00"
//                     className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
//                   // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div className="bg-gray-50 rounded-md p-2">
//                     <p className="text-gray-500">Total</p>
//                     <p className="text-gray-900 font-semibold">{total.toFixed(2)}</p>
//                   </div>
//                   <div className="bg-gray-50 rounded-md p-2">
//                     <p className="text-gray-500">Cambio</p>
//                     <p className="text-gray-900 font-semibold">{cambio.toFixed(2)}</p>
//                   </div>
//                 </div>
//                 <button
//                   className="w-full py-2 text-sm text-white rounded-md flex items-center justify-center gap-2"
//                   style={{ backgroundColor: colors.secondary.main }}
//                 >
//                   <HiCheckCircle className="h-5 w-5" /> Registrar pago
//                 </button>
//               </div>
//             )}

//             {/* Débito */}
//             {metodo === "debito" && (
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-xs text-gray-500">Banco</label>
//                   <input
//                     value={banco}
//                     onChange={(e) => setBanco(e.target.value)}
//                     type="text"
//                     placeholder="Banco X"
//                     className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
//                   // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-500">Cuenta / Tarjeta</label>
//                   <input
//                     value={cta}
//                     onChange={(e) => setCta(e.target.value)}
//                     type="text"
//                     placeholder="**** **** **** 1234"
//                     className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
//                   // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-500">Código de autorización</label>
//                   <input
//                     value={autorizacion}
//                     onChange={(e) => setAutorizacion(e.target.value)}
//                     type="text"
//                     placeholder="AUT-000123"
//                     className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
//                   // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div className="bg-gray-50 rounded-md p-2">
//                     <p className="text-gray-500">A cobrar</p>
//                     <p className="text-gray-900 font-semibold">{total.toFixed(2)} Bs</p>
//                   </div>
//                   <div className="bg-gray-50 rounded-md p-2">
//                     <p className="text-gray-500">Comisión</p>
//                     <p className="text-gray-900 font-semibold">0.00</p>
//                   </div>
//                 </div>
//                 <button
//                   className="w-full py-2 text-sm text-white rounded-md flex items-center justify-center gap-2"
//                   style={{ backgroundColor: colors.secondary.main }}
//                 >
//                   <HiCreditCard className="h-5 w-5" /> Debitar ahora
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Resumen/Recibo */}
//           <div className="bg-white rounded-lg shadow-sm p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary.bg }}>
//                 <HiReceiptRefund className="h-4 w-4" style={{ color: colors.secondary.dark }} />
//               </div>
//               <h3 className="text-sm font-medium text-gray-800">Resumen</h3>
//             </div>
//             <div className="text-xs space-y-1">
//               <div className="flex justify-between"><span className="text-gray-500">Cliente</span><span className="font-medium text-gray-800">{cliente.nombre}</span></div>
//               <div className="flex justify-between"><span className="text-gray-500">Documento</span><span className="font-medium text-gray-800">{cliente.documento}</span></div>
//               <div className="flex justify-between"><span className="text-gray-500">Método</span><span className="font-medium text-gray-800">{metodo === "caja" ? "Caja" : "Débito"}</span></div>
//               <div className="border-t pt-2 mt-2 flex justify-between text-base">
//                 <span className="font-semibold text-gray-800">Total</span>
//                 <span className="font-bold text-gray-900">{total.toFixed(2)} Bs</span>
//               </div>
//             </div>
//             <button className="mt-3 w-full text-xs border border-gray-200 rounded-md py-2 hover:bg-gray-50">Imprimir comprobante</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import {
  HiCash,
  HiCreditCard,
  HiSelector,
  HiCheckCircle,
  HiUser,
  HiReceiptRefund,
} from "react-icons/hi";
import { useAuthStore } from "../store/authStore";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import logo from '../assets/logo.png';

// Paleta usada en tus otras pantallas
const colors = {
  primary: {
    main: "#0097a6",
    light: "#00adc0",
    dark: "#007d8a",
    bg: "rgba(0, 151, 166, 0.08)",
  },
  secondary: {
    main: "#09589f",
    light: "#0a69bd",
    dark: "#074781",
    bg: "rgba(9, 88, 159, 0.08)",
  },
  gray: {
    main: "#374151",
    light: "#e5e7eb",
    bg: "rgba(55, 65, 81, 0.05)",
  },
};

// Tipos de pago
type Metodo = "caja" | "debito";
const API_URL = process.env.REACT_APP_API_URL;

type Item = {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number; // Bs
};

export default function Cobro() {
  const [metodo, setMetodo] = useState<Metodo>("caja");
  const [items, setItems] = useState<Item[]>([]);

  // 🔹 Estado del cliente (arranca vacío)
  const [cliente, setCliente] = useState<{
    documento?: string;
    nombre?: string;
    fecha_creacion?: string;
    concepto?: string;
    cantidad?: number;
    precio?: number;
    estado?: number;
    id_operacion?: number;
  }>({});

  // 🔹 Buscador
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // const generarComprobante = (cobroData: any) => {
  //   //const doc = new jsPDF();

  //   const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY: number } };
  //   // Logo
  //   doc.addImage(logo, "PNG", 10, 10, 40, 20);

  //   // Título
  //   doc.setFontSize(16);
  //   doc.text("Comprobante de Pago", 105, 20, { align: "center" });

  //   // Datos básicos
  //   doc.setFontSize(12);
  //   doc.text(`Nro Comprobante: ${cobroData.id_cliente}`, 10, 50);
  //   doc.text(`Cliente: ${cobroData.nombre_completo}`, 10, 60);
  //   doc.text(`Operación: ${cobroData.id_operacion}`, 10, 70);
  //   doc.text(`Método de Pago: ${cobroData.tipo_pago}`, 10, 80);
  //   doc.text(`Monto Recibido: Bs. ${cobroData.monto_recibido}`, 10, 90);
  //   doc.text(`Total: Bs. ${cobroData.total}`, 10, 100);
  //   doc.text(`Cuenta: ${cobroData.cuenta}`, 10, 110);
  //   doc.text(`Fecha: ${new Date(cobroData.fecha_cobro).toLocaleString()}`, 10, 120);

  //   // Tabla detalle
  //   autoTable(doc, {
  //     startY: 140,
  //     head: [["Detalle", "Monto"]],
  //     body: [
  //       ["Monto Recibido", `Bs. ${cobroData.monto_recibido}`],
  //       ["Total", `Bs. ${cobroData.total}`],
  //     ],
  //   });

  //   doc.text("Gracias por su pago", 105, (doc.lastAutoTable?.finalY ?? 140) + 20, { align: "center" });
  //   doc.save(`Operacion_${cobroData.nro_poliza || "sin_numero"}.pdf`);
  // };

  const generarComprobante = (cobroData: any) => {
    const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY: number } };

    // 🔹 Encabezado con logo y empresa
    doc.addImage(logo, "PNG", 15, 10, 30, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DIACONIA FRIF-IFD", 105, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("AVENIDA JUAN PABLO II ESQ.CALLE SBTTE, JORGE EULERT #125 - Ciudad", 105, 24, { align: "center" });
    doc.text("Tel: (591) 2-555555 | Email: info@diaconia.bo", 105, 30, {
      align: "center",
    });

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.line(15, 35, 195, 35);

    // 🔹 Título comprobante
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("COMPROBANTE DE PAGO", 105, 45, { align: "center" });

    // 🔹 Datos principales
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const fecha = new Date(cobroData.fecha_cobro).toLocaleString();

    const datos = [
      `Nro Comprobante: 00000000${cobroData.nro_comprobante}`,
      `Cliente: ${cobroData.nombre_completo}`,
      `Operación: Venta de Seguro`,
      `Producto: ${cobroData.producto}`,
      `Nro. Poliza: N° ${cobroData.nro_poliza}`,
      `Método de Pago: ${cobroData.tipo_pago}`,
      `Cuenta: ${cobroData.cuenta === "" ? "No Aplica" : cobroData.cuenta}`,
      `Fecha: ${fecha}`,
    ];

    let y = 60;
    datos.forEach((dato) => {
      doc.text(dato, 20, y);
      y += 8;
    });

    doc.setFont("helvetica", "bold");
    // 🔹 Tabla detalle
    autoTable(doc, {
      startY: y + 5,
      head: [["Detalle", "Monto (Bs.)"]],
      body: [
        ["Monto Recibido", `Bs.- ${cobroData.monto_recibido}`],
        ["Total", `Bs.- ${cobroData.total}`],
      ],
      headStyles: { fillColor: [0, 150, 136], halign: "center" }, // color corporativo
      bodyStyles: { halign: "center" },
      theme: "grid",
    });

    const finalY = (doc.lastAutoTable?.finalY ?? y) + 20;

    // 🔹 Mensaje de agradecimiento
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Gracias por confiar en nosotros", 105, finalY, { align: "center" });

    // 🔹 Pie de página
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Este comprobante es válido como constancia de pago. No requiere firma ni sello.",
      105,
      285,
      { align: "center" }
    );

    // 🔹 Guardar
    doc.save(`Comprobante_${cobroData.nro_poliza}.pdf`);
  };


  const handleCobro = async (id_operacion: number) => {
    if (id_operacion !== 0) {
      try {
        // 👉 aquí llamas tu servicio GET
        const res = await fetch(`${API_URL}/cobro/${id_operacion}`);
        if (!res.ok) throw new Error("Error al consultar el cobro");

        const cobro = await res.json();

        toast.info("Se generó el comprobante", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Generar comprobante con la respuesta del servicio
        generarComprobante({
          ...cobro,
          cliente: cobro.nombre_completo ?? "Cliente desconocido",
        });
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  const handleBuscarCliente = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/operaciones/${query}`);

      if (!res.data) {
        toast.error("Solicitud de Seguro, no existe", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setCliente({});
        setItems([]);
        return;
      }

      // Ajusta según la estructura de tu API
      setCliente({
        documento: res.data.nrodocumento,
        nombre: `${res.data.primernombre || ""} ${res.data.segundonombre || ""} ${res.data.primerapellido || ""} ${res.data.segundoapellido || ""}`.trim(),
        fecha_creacion: res.data.fecha_creacion,
        concepto: res.data.producto,
        cantidad: res.data.cantidad,
        precio: res.data.precio,
        estado: res.data.estado,
        id_operacion: res.data.id,
      });

      setItems([
        { id: 1, nombre: res.data.producto, cantidad: res.data.cantida, precio: res.data.precio },
      ]);
      setLoading(true);

    } catch (err) {
      console.error("Error al buscar cliente:", err);
      setCliente({});
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarPago = async () => {
    if (!cliente.documento) {

      toast.error("Selecciona un cliente primero", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      return;
    }

    try {
      const payload = {
        id_operacion: cliente.id_operacion, // o el ID real de la operación si lo tienes
        tipo_pago: metodo === "caja" ? 1 : 2, // "caja" o "debito"
        // monto_recibido: metodo === "caja" ? Number(montoRecibido) : total,
        total: total,
        monto_recibido: metodo === "caja" ? Number(montoRecibido) : total,
        cuenta: metodo === "debito" ? cta : "",
        usuario_creacion: user?.nombre + " " + user?.apellido,
      };

      console.log("Payload para registrar pago:", payload);
      await axios.post(`${API_URL}/cobro`, payload);
      await handleBuscarCliente();
      toast.success("Pago registrado con éxito", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });


      // console.log("Respuesta API:", res.data);

      // // Opcional: limpiar campos
      // setMontoRecibido("");
      // setCta("");
      // setBanco("");
      // setAutorizacion("");
      // setCliente({});
      // setItems([]);

    } catch (err) {
      console.error("Error al registrar pago:", err);
      alert("No se pudo registrar el pago");
    }
  };


  useEffect(() => {
    if (!cliente.nombre) return;
    setItems([
      { id: 1, nombre: cliente.concepto ?? '', cantidad: cliente.cantidad ?? 1, precio: cliente.precio ?? 0 },
    ]);
  }, [cliente]);

  // Datos simulados para items (luego puedes traerlos del backend)
  // const [items] = useState<Item[]>([
  //   { id: 1, nombre: "Seguro Maternidad – Plan A", cantidad: cliente.cantidad??0, precio: 280.0 },
  //   { id: 2, nombre: "Certificado adicional", cantidad: 1, precio: 40.0 },
  // ]);


  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.precio * it.cantidad, 0),
    [items]
  );
  const descuento = 0;
  const total = subtotal - descuento;

  // Campos específicos por método (solo UI)
  const [montoRecibido, setMontoRecibido] = useState<string>(""); // caja
  const cambio = useMemo(() => {
    const val = parseFloat(montoRecibido || "0");
    if (Number.isNaN(val)) return 0;
    return Math.max(val - total, 0);
  }, [montoRecibido, total]);

  const [banco, setBanco] = useState("");
  const [cta, setCta] = useState("");
  const [autorizacion, setAutorizacion] = useState("");

  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Cobro</h1>
            <p className="text-xs text-gray-500">
              Registro de pago por caja o débito
            </p>
          </div>
          <div className="inline-flex rounded-xl overflow-hidden border border-gray-200">
            {cliente.estado === 1 && (
              <button
                onClick={() => setMetodo("caja")}
                className={`px-3 py-2 text-xs font-medium flex items-center gap-1 ${metodo === "caja"
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
                style={
                  metodo === "caja"
                    ? { backgroundColor: colors.secondary.main }
                    : {}
                }
              >
                <HiCash className="h-4 w-4" /> Caja
              </button>
            )}
            {cliente.estado === 1 && (
              <button
                onClick={() => setMetodo("debito")}
                className={`px-3 py-2 text-xs font-medium flex items-center gap-1 border-l border-gray-200 ${metodo === "debito"
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
                style={
                  metodo === "debito"
                    ? { backgroundColor: colors.secondary.main }
                    : {}
                }
              >
                <HiCreditCard className="h-4 w-4" /> Débito
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Columna izquierda: detalle */}
        <div className="xl:col-span-2 space-y-4">
          {/* 🔹 Buscador */}
          <div className="bg-white rounded-lg shadow-sm p-2 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <label className="text-[11px] text-gray-500 whitespace-nowrap">
                  Búsqueda por Código de Solicitud de Seguro:
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={handleBuscarCliente}
                  placeholder="Código de Solicitud de Seguro"
                  className="flex-1 w-full sm:w-60 px-2 py-1 text-xs border rounded focus:ring-1 focus:outline-none"
                />
                <button
                  onClick={handleBuscarCliente}
                  disabled={loading}
                  className="w-full sm:w-auto px-3 py-1 text-xs text-white rounded flex items-center justify-center gap-1 disabled:opacity-50"
                  style={{ backgroundColor: colors.secondary.main }}
                >
                  {loading ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>
          </div>


          {/* Cliente */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary.bg }}
              >
                <HiUser
                  className="h-4 w-4"
                  style={{ color: colors.primary.dark }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cliente</p>
                <p className="text-sm font-medium text-gray-800">
                  {cliente.nombre || "No seleccionado"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-50 rounded-md p-2">
                <p className="text-gray-500">Documento</p>
                <p className="text-gray-900">
                  {cliente.documento || "—"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-md p-2">
                <p className="text-gray-500">Fecha</p>
                <p className="text-gray-900">{cliente.fecha_creacion
                  ? new Date(cliente.fecha_creacion).toLocaleDateString("es-BO")
                  : "—"}
                  { }
                </p>
              </div>
              <div className="bg-gray-50 rounded-md p-2">
                <p className="text-gray-500">Atiende</p>
                <p className="text-gray-900">{user?.nombre}.{user?.apellido}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-800">Detalle</h3>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2">Concepto</th>
                    <th className="text-center px-3 py-2">Cant.</th>
                    <th className="text-right px-3 py-2">Precio (Bs)</th>
                    <th className="text-right px-3 py-2">Importe (Bs)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {items.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="px-3 py-2 text-gray-800">{it.nombre}</td>
                      <td className="px-3 py-2 text-center">{it.cantidad}</td>
                      <td className="px-3 py-2 text-right">{it.precio.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">{(it.precio * it.cantidad).toFixed(2)}</td>
                    </tr>
                  ))} */}
                  {items.map((it) => {
                    const cantidad = Number(it.cantidad ?? 0);
                    const precio = Number(it.precio ?? 0);
                    return (
                      <tr key={it.id} className="border-t">
                        <td className="px-3 py-2 text-gray-800">{it.nombre}</td>
                        <td className="px-3 py-2 text-center">{cantidad}</td>
                        <td className="px-3 py-2 text-right">{precio.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">{(precio * cantidad).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-3">
              <div className="w-full sm:w-80 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Descuento</span><span className="font-medium">{descuento.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-800 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{total.toFixed(2)} Bs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: método de pago */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-3">Método de pago</h3>

            {/* Pago por Caja */}
            {metodo === "caja" && cliente.estado === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Monto recibido (Bs)</label>
                  <input
                    value={montoRecibido}
                    onChange={(e) => setMontoRecibido(e.target.value)}
                    type="number"
                    min={0}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
                  // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-md p-2">
                    <p className="text-gray-500">Total</p>
                    <p className="text-gray-900 font-semibold">{cliente.precio}</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <p className="text-gray-500">Cambio</p>
                    <p className="text-gray-900 font-semibold">{cambio.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={handleRegistrarPago}
                  className="w-full py-2 text-sm text-white rounded-md flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.secondary.main }}
                >
                  <HiCheckCircle className="h-5 w-5" /> Registrar pago
                </button>
              </div>
            )}

            {/* Débito */}
            {metodo === "debito" && cliente.estado === 1 && (
              <div className="space-y-3">
                {/* <div>
                  <label className="text-xs text-gray-500">Banco</label>
                  <input
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    type="text"
                    placeholder="Banco X"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
                  // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
                  />
                </div> */}
                <div>
                  <label className="text-xs text-gray-500">Cuenta / Tarjeta</label>
                  <input
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    type="text"
                    placeholder="**** **** **** 1234"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
                  // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
                  />
                </div>
                {/* <div>
                  <label className="text-xs text-gray-500">Código de autorización</label>
                  <input
                    value={autorizacion}
                    onChange={(e) => setAutorizacion(e.target.value)}
                    type="text"
                    placeholder="AUT-000123"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:outline-none"
                  // style={{ ("--tw-ring-color" as any): colors.secondary.main }}
                  />
                </div> */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-md p-2">
                    <p className="text-gray-500">A cobrar</p>
                    <p className="text-gray-900 font-semibold">{total.toFixed(2)} Bs</p>
                  </div>
                  {/* <div className="bg-gray-50 rounded-md p-2">
                    <p className="text-gray-500">Comisión</p>
                    <p className="text-gray-900 font-semibold">0.00</p>
                  </div> */}
                </div>
                <button
                  onClick={handleRegistrarPago}
                  className="w-full py-2 text-sm text-white rounded-md flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.secondary.main }}
                >
                  <HiCreditCard className="h-5 w-5" /> Debitar ahora
                </button>
              </div>
            )}
          </div>

          {/* Resumen/Recibo */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary.bg }}>
                <HiReceiptRefund className="h-4 w-4" style={{ color: colors.secondary.dark }} />
              </div>
              <h3 className="text-sm font-medium text-gray-800">Resumen</h3>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Cliente</span><span className="font-medium text-gray-800">{cliente.nombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Documento</span><span className="font-medium text-gray-800">{cliente.documento}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Método</span><span className="font-medium text-gray-800">{metodo === "caja" ? "Caja" : "Débito"}</span></div>
              <div className="border-t pt-2 mt-2 flex justify-between text-base">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-gray-900">{total.toFixed(2)} Bs</span>
              </div>
            </div>
            <button
              onClick={() => handleCobro(cliente.id_operacion ?? 0)}
              className="mt-3 w-full text-xs border border-gray-200 rounded-md py-2 hover:bg-gray-50">Imprimir comprobante</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
