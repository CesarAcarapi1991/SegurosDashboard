import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { SingleValue } from "react-select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (selectedCliente?.fechanacimiento) {
      const calculatedAge = calculateAge(selectedCliente.fechanacimiento);
      handleInputChange("edad", calculatedAge.toString());
    }
  }, [selectedCliente]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Operación Cliente</h2>
            <p className="text-sm text-gray-500">Complete la información del cliente para continuar</p>
            
            {/* Buscador mejorado */}
            <div className="mt-6">
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

        {selectedCliente && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Personal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#09589f] px-6 py-4">
                <h3 className="text-white font-semibold">Información Personal</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                    <span className="block text-gray-500 text-xs">Nombre Completo</span>
                    <span className="font-medium">
                      {`${selectedCliente.primernombre} ${selectedCliente.segundonombre || ''} ${selectedCliente.primerapellido} ${selectedCliente.segundoapellido || ''}`}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-gray-500 text-xs">Documento</span>
                    <span className="font-medium">{selectedCliente.nrodocumento}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-gray-500 text-xs">Fecha Nacimiento</span>
                    <span className="font-medium">
                      {format(new Date(selectedCliente.fechanacimiento), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de Contacto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#09589f] px-6 py-4">
                <h3 className="text-white font-semibold">Datos de Contacto</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-gray-500 text-xs">Celular</span>
                    <span className="font-medium">{selectedCliente.numerocelular || 'No registrado'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-gray-500 text-xs">Email</span>
                    <span className="font-medium">{selectedCliente.correoelectronico || 'No registrado'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de Operación */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#09589f] px-6 py-4">
                <h3 className="text-white font-semibold">Datos de Operación</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={operacionData.peso}
                      onChange={(e) => handleInputChange("peso", e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estatura (cm)</label>
                    <input
                      type="number"
                      value={operacionData.estatura}
                      onChange={(e) => handleInputChange("estatura", e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 170"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edad (calculada automáticamente)
                    </label>
                    <input
                      type="number"
                      value={operacionData.edad}
                      readOnly
                      className="w-full rounded-lg bg-gray-50 border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperacionCliente;
