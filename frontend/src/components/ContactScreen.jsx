import React from "react";
import { useEffect, useState } from "react";

export default function ContactScreen({
  ringOwner,
  ringCooldown,
  seconds,
  goTo,
  ownerPhone
}) {
  const [ringHistory, setRingHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const history =
      JSON.parse(localStorage.getItem("ringHistory")) || [];
    setRingHistory(history);
  }, [ringCooldown]);

  const lastRing =
    ringHistory.length > 0
      ? ringHistory[ringHistory.length - 1]
      : null;

  const handleRingClick = async () => {
    if (ringCooldown) return;
    setShowPopup(true);
  };

  const sendRing = async () => {
  if (!message.trim()) return;

  const phone = ownerPhone.replace(/\D/g, "");
  const text = encodeURIComponent(message);

  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");

  await ringOwner(message);

  setShowPopup(false);
  setMessage("");
};

  /* ================= RING MESSAGE SCREEN ================= */

  if (showPopup) {
    return (
      <div className="screen active">
        <h3>Message Owner</h3>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write message to vehicle owner..."
          className="emergency-textarea"
        />

        <button className="primary" onClick={sendRing}>
          Send Message
        </button>

        <button
          className="secondary"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>
      </div>
    );
  }

  /* ================= MAIN CONTACT SCREEN ================= */

  return (
    <div className="screen active">
      <h3>Contact Owner</h3>

      <div className="action-group">
        <button
          className="success"
          onClick={handleRingClick}
          disabled={ringCooldown}
        >
          {ringCooldown ? `Wait ${seconds}s` : "🔔 Ring Owner"}
        </button>

        {/* Private chat disabled for now */}
        {/*
        <button className="primary" onClick={() => goTo("chat")}>
          💬 Private Chat
        </button>
        */}

        <button
          className="secondary"
          onClick={() => goTo("emergency")}
        >
          🚨 Emergency
        </button>
      </div>

      <div className="activity-panel">
        <h3>Activity</h3>

        {lastRing ? (
          <>
            <div className="activity-item">
              🟢 Ring sent at {lastRing.time}
            </div>

            <div className="activity-item">
              📨 Owner notified
            </div>

            {ringCooldown && (
              <div className="activity-item">
                ⏳ Cooldown: {seconds}s
              </div>
            )}

            <div className="activity-item">
              📊 Total Rings: {ringHistory.length}
            </div>
          </>
        ) : (
          <div className="activity-empty">
            No activity yet.
          </div>
        )}
      </div>
    </div>
  );
}