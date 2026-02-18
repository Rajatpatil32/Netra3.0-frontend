export default function EmergencyScreen({
  handlePhoto,
  photoPreview,
  emergencyMessage,
  setEmergencyMessage,
  submitEmergency,
  emergencyStatus
}) {
  return (
    <div className="screen active">
      <h3>Emergency Alert</h3>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handlePhoto(e.target.files[0])}
      />

      {photoPreview && (
        <img
          src={photoPreview}
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "10px"
          }}
        />
      )}

      <textarea
        value={emergencyMessage}
        onChange={(e) => setEmergencyMessage(e.target.value)}
        placeholder="Describe the emergency..."
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "14px",
          resize: "none"
        }}
      />

      <button className="primary" onClick={submitEmergency}>
        Send Emergency Alert
      </button>

      <div className="status">{emergencyStatus}</div>
    </div>
  );
}
