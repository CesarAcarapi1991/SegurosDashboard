// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select, { SingleValue } from "react-select";

// interface Cliente {
//   codigocliente: number;
//   primernombre: string;
//   segundonombre?: string;
//   primerapellido: string;
//   segundoapellido?: string;
//   apellidocasada?: string;
//   tipodocumento: number;
//   nrodocumento: number;
//   complemento?: string;
//   extension?: number;
//   nacionalidad?: number;
//   ocupacion?: string;
//   fechanacimiento: string;
//   estadocivil?: number;
//   fechavencimiento?: string;
//   numerocelular?: number;
//   correoelectronico?: string;
//   marcabaja?: boolean;
// }

// const API_URL = process.env.REACT_APP_API_URL;

// const OperacionCliente: React.FC = () => {
//   const [clientes, setClientes] = useState<Cliente[]>([]);
//   const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

//   const [operacionData, setOperacionData] = useState({
//     peso: "",
//     estatura: "",
//     edad: "",
//   });

//   useEffect(() => {
//     const fetchClientes = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/clientes`);
//         setClientes(res.data);
//       } catch (error) {
//         console.error("Error al obtener clientes:", error);
//       }
//     };

//     fetchClientes();
//   }, []);

//   const clienteOptions = clientes.map(c => ({
//     value: c.codigocliente,
//     label: `${c.nrodocumento} - ${c.primernombre} ${c.primerapellido}`,
//   }));

//   const handleSelectCliente = (option: SingleValue<{ value: number; label: string }>) => {
//     if (!option) {
//       setSelectedCliente(null);
//       return;
//     }
//     const cliente = clientes.find(c => c.codigocliente === option.value) || null;
//     setSelectedCliente(cliente);
//   };

//   // 👉 Función para calcular edad
//   const calcularEdad = (fechaNacimiento: string | Date): number => {
//     const hoy = new Date();
//     const nacimiento = new Date(fechaNacimiento);
//     let edad = hoy.getFullYear() - nacimiento.getFullYear();
//     const mes = hoy.getMonth() - nacimiento.getMonth();

//     if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
//       edad--;
//     }
//     return edad;
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-sm font-semibold text-gray-800">Operación Cliente</h2>

//       <div className="grid grid-cols-3 gap-4">
//         {/* Primer Card: Buscar Cliente */}
//         <div className="p-3 border rounded-md">
//           <h4 className="text-xs font-semibold mb-2">Buscar Cliente</h4>
//           <Select
//             options={clienteOptions}
//             onChange={handleSelectCliente}
//             placeholder="Buscar por nro documento o código"
//             isClearable
//           />
//         </div>

//         {/* Segundo Card: Información del Cliente */}
//         <div className="p-3 border rounded-md">
//           <h4 className="text-xs font-semibold mb-2">Información Cliente</h4>
//           {selectedCliente ? (
//             <div className="text-xs space-y-1">
//               <p><strong>Código:</strong> {selectedCliente.codigocliente}</p>
//               <p><strong>Nombre:</strong> {selectedCliente.primernombre} {selectedCliente.segundonombre}</p>
//               <p><strong>Apellido:</strong> {selectedCliente.primerapellido} {selectedCliente.segundoapellido}</p>
//               <p><strong>Apellido Casada:</strong> {selectedCliente.apellidocasada || "-"}</p>
//               <p><strong>Nro Documento:</strong> {selectedCliente.nrodocumento}</p>
//               <p><strong>Tipo Documento:</strong> {selectedCliente.tipodocumento}</p>
//               <p><strong>Ocupación:</strong> {selectedCliente.ocupacion}</p>
//               <p><strong>Fecha Nacimiento:</strong> {selectedCliente.fechanacimiento}</p>
//               <p><strong>Edad:</strong> {selectedCliente.fechanacimiento ? calcularEdad(selectedCliente.fechanacimiento) : "-"}</p>
//               <p><strong>Celular:</strong> {selectedCliente.numerocelular}</p>
//               <p><strong>Email:</strong> {selectedCliente.correoelectronico}</p>
//             </div>
//           ) : (
//             <p className="text-xs text-gray-500">Seleccione un cliente</p>
//           )}
//         </div>

//         {/* Tercer Card: Datos de Operación */}
//         <div className="p-3 border rounded-md">
//           <h4 className="text-xs font-semibold mb-2">Datos de Operación</h4>
//           <input
//             type="number"
//             placeholder="Peso"
//             value={operacionData.peso}
//             onChange={(e) => setOperacionData({ ...operacionData, peso: e.target.value })}
//             className="w-full border px-2 py-1 mb-2 rounded text-sm"
//           />
//           <input
//             type="number"
//             placeholder="Estatura"
//             value={operacionData.estatura}
//             onChange={(e) => setOperacionData({ ...operacionData, estatura: e.target.value })}
//             className="w-full border px-2 py-1 mb-2 rounded text-sm"
//           />
//           <input
//             type="number"
//             placeholder="Edad (manual si aplica)"
//             value={operacionData.edad}
//             onChange={(e) => setOperacionData({ ...operacionData, edad: e.target.value })}
//             className="w-full border px-2 py-1 mb-2 rounded text-sm"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OperacionCliente;


import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { SingleValue } from "react-select";

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
}

interface Props {
  onChange: (data: Partial<Cliente> & { id_cliente: number | null; peso: string; estatura: string; edad: string }) => void;
}

const API_URL = process.env.REACT_APP_API_URL;

const OperacionCliente: React.FC<Props> = ({ onChange }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const [operacionData, setOperacionData] = useState({
    peso: "",
    estatura: "",
    edad: "",
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get(`${API_URL}/clientes`);
        setClientes(res.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const clienteOptions = clientes.map(c => ({
    value: c.codigocliente,
    label: `${c.nrodocumento} - ${c.primernombre} ${c.primerapellido}`,
  }));

  const handleSelectCliente = (option: SingleValue<{ value: number; label: string }>) => {
    const cliente = option ? clientes.find(c => c.codigocliente === option.value) || null : null;
    setSelectedCliente(cliente);
    onChange({ id_cliente: cliente?.codigocliente || null, ...cliente, ...operacionData });
  };

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...operacionData, [field]: value };
    setOperacionData(newData);
    onChange({ id_cliente: selectedCliente?.codigocliente || null, ...selectedCliente, ...newData });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-800">Operación Cliente</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-semibold mb-2">Buscar Cliente</h4>
          <Select
            options={clienteOptions}
            onChange={handleSelectCliente}
            placeholder="Buscar por nro documento o código"
            isClearable
          />
        </div>

        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-semibold mb-2">Información Cliente</h4>
          {selectedCliente ? (
            <div className="text-xs space-y-1">
              <p><strong>Código:</strong> {selectedCliente.codigocliente}</p>
              <p><strong>Nombre:</strong> {selectedCliente.primernombre} {selectedCliente.segundonombre}</p>
              <p><strong>Apellido:</strong> {selectedCliente.primerapellido} {selectedCliente.segundoapellido}</p>
              <p><strong>Apellido Casada:</strong> {selectedCliente.apellidocasada || "-"}</p>
              <p><strong>Nro Documento:</strong> {selectedCliente.nrodocumento}</p>
              <p><strong>Tipo Documento:</strong> {selectedCliente.tipodocumento}</p>
              <p><strong>Ocupación:</strong> {selectedCliente.ocupacion}</p>
              <p><strong>Fecha Nacimiento:</strong> {selectedCliente.fechanacimiento}</p>
              <p><strong>Celular:</strong> {selectedCliente.numerocelular}</p>
              <p><strong>Email:</strong> {selectedCliente.correoelectronico}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Seleccione un cliente</p>
          )}
        </div>

        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-semibold mb-2">Datos de Operación</h4>
          <input
            type="number"
            placeholder="Peso"
            value={operacionData.peso}
            onChange={(e) => handleInputChange("peso", e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded text-sm"
          />
          <input
            type="number"
            placeholder="Estatura"
            value={operacionData.estatura}
            onChange={(e) => handleInputChange("estatura", e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded text-sm"
          />
          <input
            type="number"
            placeholder="Edad (manual si aplica)"
            value={operacionData.edad}
            onChange={(e) => handleInputChange("edad", e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default OperacionCliente;
