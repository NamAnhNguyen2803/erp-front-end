import axios from 'axios';

export const getProductionReports = () => axios.get('/api/reports/production');
export const getInventoryReports = () => axios.get('/api/reports/inventory'); 