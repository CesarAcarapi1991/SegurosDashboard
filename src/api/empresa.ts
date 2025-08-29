import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export interface Empresa {
  id?: number;
  nombre: string;
  descripcion: string;
  marcabaja: boolean;
  usuario_creacion?: string;
  fecha_creacion?: string;
}

// Listar todas las empresas
export const getEmpresas = async (): Promise<Empresa[]> => {
  const { data } = await axios.get(`${API_URL}/empresas`);
  return data;
};

// Crear empresa
export const createEmpresa = async (empresa: Partial<Empresa>): Promise<Empresa> => {
  const { data } = await axios.post(`${API_URL}/empresas`, empresa);
  return data;
};

// Actualizar empresa
export const updateEmpresa = async (id: number, empresa: Partial<Empresa>): Promise<Empresa> => {
  const { data } = await axios.put(`${API_URL}/empresas/${id}`, empresa);
  return data;
};

// Eliminar empresa (lógicamente según tu backend)
export const deleteEmpresa = async (id: number): Promise<{ message: string }> => {
  const { data } = await axios.delete(`${API_URL}/empresas/${id}`);
  return data;
};
