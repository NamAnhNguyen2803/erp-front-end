import axios from 'axios';

export const getUsers = () => axios.get('/api/users');
export const createUser = (data) => axios.post('/api/users', data);
export const updateUser = (id, data) => axios.put(`/api/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`/api/users/${id}`);
export const toggleUserStatus = (id, status) => axios.put(`/api/users/${id}/status`, { status });
export const getProfile = () => axios.get('/api/users/profile');
export const updateProfile = (data) => axios.put('/api/users/profile', data); 