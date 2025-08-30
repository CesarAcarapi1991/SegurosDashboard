import ReporteExcel from "../components/ReporteOperaciones";

function Operaciones() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Operaciones</h1>
      {/* Aquí va tu tabla de operaciones */}
      <ReporteExcel />
    </div>
  );
}

export default Operaciones;