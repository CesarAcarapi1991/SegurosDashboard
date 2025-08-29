import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export interface LoginResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  // agrega otros campos que tu API retorne
}

export const loginUser = async (correo: string, contrasena: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/usuarios/login`, {
    correo,
    contrasena,
  });
  return response.data;
};
