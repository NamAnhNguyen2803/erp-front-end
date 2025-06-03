import axios from 'axios';
const API_URL = 'http://localhost:3030/api/v1/';
export const getWarehouses = () => axios.get(`${API_URL}warehouses`);
export const createWarehouse = (data) => axios.post(`${API_URL}warehouses`, data);
export const updateWarehouse = (id, data) => axios.put(`${API_URL}warehouses/${id}`, data);
export const deleteWarehouse = (id) => axios.delete(`${API_URL}warehouses/${id}`);
export const getInventoryByWarehouse = (id) => axios.get(`${API_URL}warehouse/${id}`);


export const getTransactions = () => axios.get(`${API_URL}inventory/transactions`);
export const createTransaction = (data) => axios.post(`${API_URL}inventory/transactions`, data);
export const updateTransaction = (id, data) => axios.put(`${API_URL}inventory/transactions/${id}`, data);
export const deleteTransaction = (id) => axios.delete(`${API_URL}inventory/transactions/${id}`); 