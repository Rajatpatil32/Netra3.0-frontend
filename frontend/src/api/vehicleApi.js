const BASE_URL = "http://localhost:3000/api";

const request = async (url, options = {}) => {
  const res = await fetch(BASE_URL + url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Get vehicle by QR
export const fetchVehicleByQR = async (qrId) => {
  const res = await fetch(`/api/vehicle/${qrId}`);

  const data = await res.json();

  // 👇 THIS LINE IS THE FIX
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};


// Register vehicle
export const registerVehicle = (data) =>
  request(`/vehicle/register`, {
    method: "POST",
    body: JSON.stringify(data)
  });


// Send ring request
export const sendRingRequest = (data) =>
  request(`/ring`, {
    method: "POST",
    body: JSON.stringify(data)
  });


// Send emergency alert
export const sendEmergencyAlert = (data) =>
  request(`/emergency`, {
    method: "POST",
    body: JSON.stringify(data)
  });