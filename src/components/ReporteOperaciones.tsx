// import React from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { getOperaciones } from "../services/operaciones";

// const ReporteOperaciones: React.FC = () => {
//   const generarExcel = async () => {
//     const operaciones = await getOperaciones();

//     if (operaciones.length === 0) {
//       alert("No hay datos para exportar.");
//       return;
//     }

//     // 🔹 Transformar los datos con encabezados personalizados
//     const datosFormateados = operaciones.map((op: any) => ({
//       "Nro Póliza": op.nro_poliza,
//       "Cliente": `${op.primernombre} ${op.primerapellido}`,
//       "Producto": op.id_seguro_producto,
//       "Documento": `${op.tipodocumento} ${op.nrodocumento}`,
//       "Celular": op.numerocelular,
//       "Fecha Nacimiento": new Date(op.fechanacimiento).toLocaleDateString(),
//       "Estado": op.estado,
//     }));

//     // 🔹 Crear hoja con encabezados personalizados
//     const ws = XLSX.utils.json_to_sheet(datosFormateados);

//     // 🔹 Ajustar ancho de columnas automáticamente
//     const colWidths = Object.keys(datosFormateados[0]).map(key => {
//       const maxLength = Math.max(
//         key.length,
//         ...datosFormateados.map((row: any) => String(row[key] || "").length)
//       );
//       return { wch: maxLength + 2 };
//     });
//     ws["!cols"] = colWidths;

//     // 🔹 Crear libro y agregar hoja
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Operaciones");

//     // 🔹 Generar archivo Excel
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "ReporteOperaciones.xlsx");
//   };

//   return (
//     <button
//       onClick={generarExcel}
//       className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-md"
//     >
//       📊 Generar Reporte Excel
//     </button>
//   );
// };

// export default ReporteOperaciones;


import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getOperaciones } from "../services/operaciones";

const ReporteOperaciones: React.FC = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estado, setEstado] = useState("");

  const generarExcel = async () => {
    try {
      const filtros: any = {};
      if (fechaDesde) filtros.fecha_desde = fechaDesde;
      if (fechaHasta) filtros.fecha_hasta = fechaHasta;
      if (estado) filtros.estado = estado;

      const operaciones = await getOperaciones(filtros);

      if (!operaciones || operaciones.length === 0) {
        alert("No hay datos para exportar.");
        return;
      }

      // 🔹 Transformar los datos con encabezados personalizados
      const datosFormateados = operaciones.map((op: any) => ({
        "Nro Póliza": op.nro_poliza,
        "Cliente": `${op.primernombre || ""} ${op.primerapellido || ""}`,
        "Producto": op.id_seguro_producto,
        "Documento": `${op.tipodocumento || ""} ${op.nrodocumento || ""}`,
        "Celular": op.numerocelular || "",
        "Fecha Nacimiento": op.fechanacimiento
          ? new Date(op.fechanacimiento).toLocaleDateString()
          : "",
        "Estado": op.estado === 1 ? "Vigente" : "Generado",
      }));

      // 🔹 Crear hoja con encabezados personalizados
      const ws = XLSX.utils.json_to_sheet(datosFormateados);

      // 🔹 Ajustar ancho de columnas automáticamente
      const colWidths = Object.keys(datosFormateados[0]).map((key) => {
        const maxLength = Math.max(
          key.length,
          ...datosFormateados.map((row: any) => String(row[key] || "").length)
        );
        return { wch: maxLength + 2 };
      });
      ws["!cols"] = colWidths;

      // 🔹 Crear libro y agregar hoja
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Operaciones");

      // 🔹 Generar archivo Excel
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "ReporteOperaciones.xlsx");
    } catch (err) {
      console.error("Error al generar Excel:", err);
      alert("Ocurrió un error al generar el reporte.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          className="px-2 py-1 border rounded w-full sm:w-auto"
          placeholder="Fecha desde"
        />
        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          className="px-2 py-1 border rounded w-full sm:w-auto"
          placeholder="Fecha hasta"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="px-2 py-1 border rounded w-full sm:w-auto"
        >
          <option value="">Todos los estados</option>
          <option value="1">Vigente</option>
          <option value="0">Generado</option>
        </select>
      </div>

      {/* Botón de exportar */}
      <button
        onClick={generarExcel}
        className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-md"
      >
        📊 Generar Reporte Excel
      </button>
    </div>
  );
};

export default ReporteOperaciones;
