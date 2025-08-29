import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getBloques = async () => {
  const res = await axios.get(`${API_URL}/bloques`);
  return res.data;
};

export const createBloque = async (data: any) => {
  const res = await axios.post(`${API_URL}/bloques`, data);
  return res.data;
};

export const updateBloque = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/bloques/${id}`, data);
  return res.data;
};

export const deleteBloque = async (id: number) => {
  const res = await axios.delete(`${API_URL}/bloques/${id}`);
  return res.data;
};
