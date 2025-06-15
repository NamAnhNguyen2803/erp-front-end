import axios from 'axios';

const API_URL = 'http://localhost:3030/api/v1';

export const getMaterials = () => axios.get(`${API_URL}/materials`);
export const createMaterial = (data) => axios.post(`${API_URL}/materials`, data);
export const updateMaterial = (id, data) => axios.put(`${API_URL}/materials/${id}`, data);
export const deleteMaterial = (id) => axios.delete(`${API_URL}/materials/${id}`); 

export const getProducts = () => axios.get(`${API_URL}/products`);
export const createProduct = (data) => axios.post(`${API_URL}/products`, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`); 

export const getSemiProducts = () => axios.get('/api/semi-products');
export const createSemiProduct = (data) => axios.post('/api/semi-products', data);
export const updateSemiProduct = (id, data) => axios.put(`/api/semi-products/${id}`, data);
export const deleteSemiProduct = (id) => axios.delete(`/api/semi-products/${id}`); 