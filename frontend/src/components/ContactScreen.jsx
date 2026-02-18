import { useEffect, useState } from "react";

export default function ContactScreen({
  ringOwner,
  ringCooldown,
  seconds,
  goTo
}) {
  const [ringHistory, setRingHistory] = useState([]);

  useEffect(() => {
    const history =
      JSON.parse(localStorage.getItem("ringHistory")) || [];
    setRingHistory(history);
  }, [ringCooldown]);

  const lastRing =
    ringHistory.length > 0
      ? ringHistory[ringHistory.length - 1]
      : null;

  return (
    <div className="screen active">
      <h3>Contact Owner</h3>

      {/* ACTION BUTTONS GROUP */}
      <div className="action-group">
        <button
          className="success"
          onClick={ringOwner}
          disabled={ringCooldown}
        >
          {ringCooldown ? `Wait ${seconds}s` : "🔔 Ring Owner"}
        </button>

        <button className="primary" onClick={() => goTo("chat")}>
          💬 Private Chat
        </button>

        <button
          className="secondary"
          onClick={() => goTo("emergency")}
        >
          🚨 Emergency
        </button>
      </div>

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
