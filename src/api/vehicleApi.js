export const fetchVehicleByQR = async (qrId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          qrId,
          vehicleNumber: "MH12AB1234"
        }
      });
    }, 400);
  });
};

export const verifyVehicleNumber = async (qrId, vehicleNumber) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (vehicleNumber.toUpperCase() === "MH12AB1234") {
        resolve({ success: true });
      } else {
        reject({ message: "Mismatch" });
      }
    }, 400);
  });
};

export const verifyVisitorPhone = async (phone) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (phone.length === 10) resolve({ success: true });
      else reject({ message: "Invalid phone" });
    }, 400);
  });
};

export const sendRingRequest = async () => {
  return Promise.resolve({ success: true });
};

export const sendEmergencyAlert = async (data) => {
  return Promise.resolve({ success: true });
};
