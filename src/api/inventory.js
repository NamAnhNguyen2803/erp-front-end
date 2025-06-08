import axios from 'axios';
const API_URL = 'http://localhost:3030/api/v1';
export const getWarehouses = () => axios.get(`${API_URL}/warehouses`);
export const createWarehouse = (data) => axios.post(`${API_URL}/warehouses`, data);
export const updateWarehouse = (id, data) => axios.put(`${API_URL}/warehouses/${id}`, data);
export const deleteWarehouse = (id) => axios.delete(`${API_URL}/warehouses/${id}`);
export const getInventoryByWarehouse = (id) => axios.get(`${API_URL}/warehouse/${id}`);


export const importGoods = (data) =>
    axios.post(`${API_URL}/transactions/import`, data);

// Xuất kho
export const exportGoods = (data) =>
    axios.post(`${API_URL}/transactions/export`, data);

// Chuyển kho
export const transferGoods = (data) =>
    axios.post(`${API_URL}/transactions/transfer`, data);

// Tổng hợp tồn kho
export const getInventorySummary = () =>
    axios.get(`${API_URL}/transactions/`);

// Lấy tất cả giao dịch
export const getAllInventoryTransactions = () =>
    axios.get(`${API_URL}/transactions/all`);

// Lấy chi tiết giao dịch theo ID
export const getTransactionById = (id) =>
    axios.get(`${API_URL}/transactions/${id}`);