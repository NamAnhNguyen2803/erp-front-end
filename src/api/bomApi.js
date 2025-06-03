import axios from 'axios';

const API_URL = 'http://localhost:3030/api/v1'; 

export const getAllBoms = async (params) => {
  const response = await axios.get(`${API_URL}/boms`, { params });
  return response.data;
};

export const getBomById = async (bomId) => {
  const response = await axios.get(`${API_URL}/boms/${bomId}`);
  return response.data;
};

export const createBom = async (data) => {
  const response = await axios.post(`${API_URL}/boms`, data);
  return response.data;
};


export const updateBom = async (bomId, data) => {
  const response = await axios.put(`${API_URL}/boms/${bomId}`, data);
  console.log('Updating BOM with:', bomId, data);
  return response.data;
};
export const deleteBom = (id) => axios.delete(`${API_URL}/${id}`);