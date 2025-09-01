import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getOperaciones = async (filtros?: any) => {
  try {


    const response = await axios.get(`${API_URL}/operaciones/reporte?${filtros.toString()}`);

    //const response = await axios.get(`${API_URL}/operaciones/reporte`);
    return response.data; 
  } catch (error) {
    console.error("Error al obtener operaciones:", error);
    return [];
  }
};
