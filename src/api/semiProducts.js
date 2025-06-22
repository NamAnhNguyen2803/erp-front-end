import axios from 'axios';

export const getSemiProducts = () => axios.get('/api/semi-products');
export const createSemiProduct = (data) => axios.post('/api/semi-products', data);
export const updateSemiProduct = (id, data) => axios.put(`/api/semi-products/${id}`, data);
export const deleteSemiProduct = (id) => axios.delete(`/api/semi-products/${id}`); 