import axios from 'axios';

const API_URL = 'http://localhost:3030/api/v1';

// GET /api/v1/boms - Get all BOMs
export const getAllBoms = () => axios.get(`${API_URL}/boms`);

// GET /api/v1/boms/:bom_id - Get BOM by ID with items
export const getBomById = (bom_id) => axios.get(`${API_URL}/boms/${bom_id}`);
    
// POST /api/v1/boms - Create a new BOM
export const createBom = (data) => axios.post(`${API_URL}/boms`, data);

// PUT /api/v1/boms/:bom_id - Update BOM
export const updateBom = (bom_id, data) => axios.put(`${API_URL}/boms/${bom_id}`, data);

// DELETE /api/v1/boms/:bom_id - Delete BOM
export const deleteBom = (bom_id) => axios.delete(`${API_URL}/boms/${bom_id}`);

// GET /api/v1/bom-items - Get all BOM items
export const getAllBomItems = () => axios.get(`${API_URL}/bom-items`);

// POST /api/v1/bom-items - Create a new BOM item
export const createBomItem = (data) => axios.post(`${API_URL}/bom-items`, data);

// PUT /api/v1/bom-items/:item_id - Update BOM item
export const updateBomItem = (item_id, data) => axios.put(`${API_URL}/bom-items/${item_id}`, data);

// DELETE /api/v1/bom-items/:item_id - Delete BOM item
export const deleteBomItem = (item_id) => axios.delete(`${API_URL}/bom-items/${item_id}`);