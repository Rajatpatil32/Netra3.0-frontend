import React from "react";
import { useState, useEffect } from "react";

export default function EmergencyScreen({
  handlePhoto,
  photoPreview,
  emergencyMessage,
  setEmergencyMessage,
  submitEmergency,
  goTo
}) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!photoPreview)
      return setStatus("Please capture or upload a photo.");

    if (!emergencyMessage.trim())
      return setStatus("Please describe the emergency.");

    setLoading(true);

    try {
      await submitEmergency();
    } catch (err) {
      setLoading(false);
      return setStatus(err.message);
    }

    // Store history locally
    const history =
      JSON.parse(localStorage.getItem("emergencyHistory")) || [];

    history.push({
      message: emergencyMessage,
      time: new Date().toLocaleString()
    });

    localStorage.setItem(
      "emergencyHistory",
      JSON.stringify(history)
    );

    setLoading(false);
    setShowSuccess(true);

    // Clear form
    setEmergencyMessage("");
  };

  // Redirect after 3 sec
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        goTo("contact");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, goTo]);

  return (
    <div className="screen active">
      {!showSuccess ? (
        <>
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
              alt="Preview"
              className="preview-image"
            />
          )}

          <textarea
            value={emergencyMessage}
            onChange={(e) => setEmergencyMessage(e.target.value)}
            placeholder="Describe the emergency..."
            className="emergency-textarea"
          />

          <button
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Emergency Alert"}
          </button>

          {status && <div className="error">{status}</div>}
        </>
      ) : (
        <div className="whatsapp-confirm">
          <div className="checkmark"></div>
          <h4>Emergency Alert Sent</h4>
          <p>
            We’ve notified the vehicle owner via WhatsApp.
            You will be informed if they respond.
          </p>
        </div>
      )}
    </div>
  );
}
