import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getOperaciones } from "../services/operaciones";

const ReporteOperaciones: React.FC = () => {

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

  // Filtros nuevos
  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  // Formatear a YYYY-MM-DD para input type="date"
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [fechaDesde, setFechaDesde] = useState(formatDate(haceUnaSemana));
  const [fechaHasta, setFechaHasta] = useState(formatDate(hoy));
  const [estado, setEstado] = useState("0");
  
  const generarExcel = async () => {
  try {
    

    const params = new URLSearchParams();
          if (fechaDesde) params.append("fecha_desde", fechaDesde);
          if (fechaHasta) params.append("fecha_hasta", fechaHasta);
          if (estado) params.append("estado", estado);
    

    const operaciones = await getOperaciones(params);

    if (!operaciones || operaciones.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const datosFormateados = operaciones.map((op: any) => ({
      "Nro. Solicitud": op.nro_operacion,
      "Nro. Poliza": op.nro_poliza,
      "Empresa": op.nombre,
      "Producto": op.producto,
      "Precio": op.precio,
      "Codigo Cliente": op.id_cliente,
      "Tipo Documento": op.tipo_documento,
      "Nro. Documento": op.nro_documento,
      "Nombre Cliente": op.nombre_completo,
      "Fecha Nacimiento": op.fechanacimiento.toString().substring(0, 10),
      "Estado Civil": op.estado_civil,
      "Tipo Pago": op.tipopago,
      "Cuenta": op.cuenta,
      "Fecha Solicitud": op.fechasolicitud.toString().substring(0, 10),
      "Fecha Pago": op.fechacobro?.toString().substring(0, 10),
      "Estado Solicitud": op.estado_desc,
    }));

    const ws: XLSX.WorkSheet = {};

    // 🏷️ Título elegante
    const titulo = "Reporte de Solicitudes - Seguros";
    XLSX.utils.sheet_add_aoa(ws, [[titulo]], { origin: "A1" });

    // Datos desde fila 3
    XLSX.utils.sheet_add_json(ws, datosFormateados, { origin: "A3", skipHeader: false });

    // Ajustar columnas
    const colWidths = Object.keys(datosFormateados[0]).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...datosFormateados.map((row: any) => String(row[key] || "").length)
      );
      return { wch: maxLength + 4 }; // un poco más de espacio
    });
    ws["!cols"] = colWidths;

    // Merge para el título
    ws["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: Object.keys(datosFormateados[0]).length - 1 },
      },
    ];

    // 🎨 Estilo Título
    ws["A1"].s = {
      font: { sz: 16, bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "003366" } }, // Azul corporativo oscuro
    };

    // 🎨 Estilo cabeceras (fila 3 → índice r=2)
    const headerRow = 2;
    Object.keys(datosFormateados[0]).forEach((_, i) => {
      const cell = ws[XLSX.utils.encode_cell({ r: headerRow, c: i })];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "0073b1" } }, // Azul intermedio elegante
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    });

    // 🎨 Estilo filas de datos (striped + bordes finos)
    for (let r = 3; r < datosFormateados.length + 3; r++) {
      Object.keys(datosFormateados[0]).forEach((_, c) => {
        const cell = ws[XLSX.utils.encode_cell({ r, c })];
        if (cell) {
          cell.s = {
            font: { color: { rgb: "000000" } },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              fgColor: { rgb: r % 2 === 0 ? "F2F2F2" : "FFFFFF" }, // alterna gris
            },
            border: {
              top: { style: "thin", color: { rgb: "DDDDDD" } },
              bottom: { style: "thin", color: { rgb: "DDDDDD" } },
              left: { style: "thin", color: { rgb: "DDDDDD" } },
              right: { style: "thin", color: { rgb: "DDDDDD" } },
            },
          };
        }
      });
    }

    // Crear libro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Operaciones");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ReporteOperaciones.xlsx");
  } catch (err) {
    console.error("Error al generar Excel:", err);
    alert("Ocurrió un error al generar el reporte.");
  }
};

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Reporte de Solicitudes de Seguros</h1>
            <p className="text-xs text-gray-500">Reporte por periodo de tiempo de solicitudes de seguros</p>
          </div>
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
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
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
              onClick={generarExcel}
              className="px-3 py-1.5 text-xs font-medium text-white rounded"
              style={{ backgroundColor: colors.secondary.main }}
            >
              Generar Reporte Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteOperaciones;
