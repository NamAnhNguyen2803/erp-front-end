import axios from 'axios';

const API_URL = 'http://localhost:3030/api/v1';

export const getMaterials = () => axios.get(`${API_URL}/materials`);
export const createMaterial = (data) => axios.post(`${API_URL}/materials`, data);
export const updateMaterial = (id, data) => axios.put(`${API_URL}/materials/${id}`, data);
export const deleteMaterial = (id) => axios.delete(`${API_URL}/materials/${id}`); 