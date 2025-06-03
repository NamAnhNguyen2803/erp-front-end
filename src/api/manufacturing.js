import axios from 'axios';

const API_URL = 'http://localhost:3030/api/v1'; 

export const getPlans = () => axios.get(`${API_URL}/plans`);
export const getPlanDetails = (id) => axios.get(`${API_URL}/plans/${id}`);
export const createPlan = (data) => axios.post(`${API_URL}/plans`, data);
export const updatePlan = (id, data) => axios.put(`${API_URL}/plans/${id}`, data);
export const deletePlan = (id) => axios.delete(`${API_URL}/plans/${id}`);

export const getAllOrders = () => axios.get(`${API_URL}/orders`);
export const getOrderDetail = (id) => axios.get(`${API_URL}/orders/${id}`);
export const createOrder = (data) => axios.post(`${API_URL}/orders`, data);
export const updateOrder = (id, data) => axios.put(`${API_URL}/orders/${id}`, data);
export const deleteOrder = (id) => axios.delete(`${API_URL}/orders/${id}`);
export const approveOrder = (id) => axios.patch(`${API_URL}/orders/${id}/approve`);

export const getAllOrdersDetails = () => axios.get(`${API_URL}/order-details`);
export const createOrderDetail = (data) => axios.post(`${API_URL}/order-details`, data);
export const updateOrderDetail = (id, data) => axios.put(`${API_URL}/order-details/${id}`, data);
export const deleteOrderDetail = (id) => axios.delete(`${API_URL}/order-details/${id}`);
export const getWorkOrdersByOrderId = (id) => axios.get(`${API_URL}/order-details/work-orders/${id}`);
export const getMaterialStatus = (id) => axios.get(`${API_URL}/work-orders/${id}/material-status`);

export const getSteps = () => axios.get(`${API_URL}/steps`);
export const createStep = (data) => axios.post(`${API_URL}/steps`, data);
export const updateStep = (id, data) => axios.put(`${API_URL}/steps/${id}`, data);
export const deleteStep = (id) => axios.delete(`${API_URL}/steps/${id}`);

export const getWorkOrders = () => axios.get(`${API_URL}/work-orders`);
export const createWorkOrder = (data) => axios.post(`${API_URL}/work-orders`, data);
export const updateWorkOrder = (id, data) => axios.put(`${API_URL}/work-orders/${id}`, data);
export const deleteWorkOrder = (id) => axios.delete(`${API_URL}/work-orders/${id}`);
export const getWorkOrderDetail = (id) => axios.get(`${API_URL}/work-orders/${id}`);
export const startWorkOrder = (id) => axios.patch(`${API_URL}/work-orders/${id}/start`);
export const completeWorkOrder = (id) => axios.patch(`${API_URL}/work-orders/${id}/complete`);
export const assignWorkOrder = (id, data) => axios.patch(`${API_URL}/work-orders/${id}/assign`, data);

export const getRequirements = () => axios.get(`${API_URL}/requirements`);
export const createRequirement = (data) => axios.post(`${API_URL}/requirements`, data);
export const updateRequirement = (id, data) => axios.put(`${API_URL}/requirements/${id}`, data);
export const deleteRequirement = (id) => axios.delete(`${API_URL}/requirements/${id}`); 