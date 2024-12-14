import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getEquipment = () => axios.get(`${API_URL}/equipment`);
export const addEquipment = (data) => axios.post(`${API_URL}/equipment`, data);
export const editEquipment = (id, data) => axios.put(`${API_URL}/equipment/${id}`, data);
export const deleteEquipment = (id) => axios.delete(`${API_URL}/equipment/${id}`);

export const getActivity = () => axios.get(`${API_URL}/activity`);
export const addActivity = (data) => axios.post(`${API_URL}/activity`, data);
export const editActivity = (id, data) => axios.put(`${API_URL}/activity/${id}`, data);
export const deleteActivity = (id) => axios.delete(`${API_URL}/activity/${id}`);

export const getLab = () => axios.get(`${API_URL}/lab`);
export const addLab = (data) => axios.post(`${API_URL}/lab`, data);
export const editLab = (id, data) => axios.put(`${API_URL}/lab/${id}`, data);
export const deleteLab = (id) => axios.delete(`${API_URL}/lab/${id}`);