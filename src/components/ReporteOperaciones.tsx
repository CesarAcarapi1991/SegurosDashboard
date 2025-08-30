import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getOperaciones } from "../services/operaciones";

const ReporteOperaciones: React.FC = () => {
  const generarExcel = async () => {
    const operaciones = await getOperaciones();

    if (operaciones.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // 🔹 Transformar los datos con encabezados personalizados
    const datosFormateados = operaciones.map((op: any) => ({
      "Nro Póliza": op.nro_poliza,
      "Cliente": `${op.primernombre} ${op.primerapellido}`,
      "Producto": op.id_seguro_producto,
      "Documento": `${op.tipodocumento} ${op.nrodocumento}`,
      "Celular": op.numerocelular,
      "Fecha Nacimiento": new Date(op.fechanacimiento).toLocaleDateString(),
      "Estado": op.estado,
    }));

    // 🔹 Crear hoja con encabezados personalizados
    const ws = XLSX.utils.json_to_sheet(datosFormateados);

    // 🔹 Ajustar ancho de columnas automáticamente
    const colWidths = Object.keys(datosFormateados[0]).map(key => {
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
  };

  return (
    <button
      onClick={generarExcel}
      className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-md"
    >
      📊 Generar Reporte Excel
    </button>
  );
};

export default ReporteOperaciones;
