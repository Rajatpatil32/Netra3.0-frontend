import api from "./axiosInstance";


// Fetch vehicle by QR
export const fetchVehicleByQR = (qrId) =>
  api.get(`/vehicle/${qrId}`);


// Register vehicle
export const registerVehicle = (data) =>
  api.post(`/vehicle/register`, data);


// Ring owner
export const sendRingRequest = (data) =>
  api.post(`/ring`, data);


// Emergency alert
export const sendEmergencyAlert = (data) =>
  api.post(`/emergency`, data);