import React from "react";
export default function VehicleScreen({
  blurredQR,
  vehicleInput,
  setVehicleInput,
  verifyVehicle,
  vehicleStatus
}) {
  return (
    <div className="screen active">
      <h3>Vehicle Verification</h3>

      <p style={{ textAlign: "center" }}>
        Vehicle: <b>{blurredQR}</b>
      </p>

      <input
        value={vehicleInput}
        onChange={(e) => setVehicleInput(e.target.value)}
        placeholder="Enter full vehicle numberr"
      />

      <button className="primary" onClick={() => verifyVehicle(blurredQR, vehicleInput)}>
        Verify
      </button>

      <div className="status error">{vehicleStatus}</div>
    </div>
  );
}
