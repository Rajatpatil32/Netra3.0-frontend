import { useEffect, useState } from "react";

export default function ContactScreen({
  ringOwner,
  ringCooldown,
  seconds,
  goTo
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
    await ringOwner(message);
    setShowPopup(false);
    setMessage("");
    alert("Owner notified. He will contact you soon.");
  };

  return (
    <div className="screen active">
      <h3>Contact Owner</h3>

      {/* ACTION BUTTONS GROUP */}
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

      {/* POPUP MESSAGE BOX */}
      {showPopup && (
        <div className="popup">
          <div className="popup-box">
            <h4>Message to Owner</h4>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message..."
            />

            <button className="primary" onClick={sendRing}>
              Send
            </button>

            <button
              className="secondary"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ACTIVITY PANEL AT BOTTOM */}
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