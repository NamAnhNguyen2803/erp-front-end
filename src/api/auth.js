import axios from 'axios';

export const login = (data) => axios.post('/api/auth/login', data);
export const logout = () => axios.post('/api/auth/logout'); 