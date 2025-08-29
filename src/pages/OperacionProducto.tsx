import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { SingleValue } from "react-select";

interface Empresa {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  producto: string;
  descripcion?: string;
  precio?: string;
  empresa_id: number;
}

interface Certificado {
  id: number;
  id_producto: number;
  codigo: string;
  descripcion?: string;
}

interface Props {
  onChange: (data: { id_seguro_producto: number | null; id_certificado: number | null }) => void;
}

const API_URL = process.env.REACT_APP_API_URL;

const OperacionProducto: React.FC<Props> = ({ onChange }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState<Certificado | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, empRes, certRes] = await Promise.all([
          axios.get(`${API_URL}/productos`),
          axios.get(`${API_URL}/empresas`),
          axios.get(`${API_URL}/certificados`)
        ]);
        setProductos(prodRes.data);
        setEmpresas(empRes.data);
        setCertificados(certRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectProducto = (option: SingleValue<{ value: number; label: string }>) => {
    if (!option) {
      setSelectedProducto(null);
      setCertificadoSeleccionado(null);
      onChange({ id_seguro_producto: null, id_certificado: null });
      return;
    }

    const producto = productos.find(p => p.id === option.value) || null;
    setSelectedProducto(producto);

    const cert = certificados.find(c => c.id_producto === option.value) || null;
    setCertificadoSeleccionado(cert);

    onChange({ id_seguro_producto: producto?.id || null, id_certificado: cert?.id || null });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-800">Operación Producto</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 border rounded-md">
          <label className="text-xs font-medium">Producto</label>
          <Select
            options={productos.map(p => ({ value: p.id, label: p.producto }))}
            value={selectedProducto ? { value: selectedProducto.id, label: selectedProducto.producto } : null}
            onChange={handleSelectProducto}
            placeholder="Seleccione un producto"
            isClearable
          />
        </div>

        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-semibold mb-2">Información Producto</h4>
          {selectedProducto ? (
            (() => {
              const empresa = empresas.find(e => e.id === selectedProducto.empresa_id);
              return (
                <div className="text-xs space-y-1">
                  <p><strong>Empresa:</strong> {empresa?.nombre || "-"}</p>
                  <p><strong>Producto:</strong> {selectedProducto.producto}</p>
                  <p><strong>Precio:</strong> {selectedProducto.precio || "-"}</p>
                  <p><strong>Descripción:</strong> {selectedProducto.descripcion || "-"}</p>
                </div>
              );
            })()
          ) : (
            <p className="text-xs text-gray-500">Seleccione un producto</p>
          )}
        </div>

        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-semibold mb-2">Certificado Activo</h4>
          {certificadoSeleccionado ? (
            <div className="text-xs space-y-1">
              <p><strong>Código:</strong> {certificadoSeleccionado.codigo}</p>
              <p><strong>Descripción:</strong> {certificadoSeleccionado.descripcion}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">No hay certificado activo</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperacionProducto;
