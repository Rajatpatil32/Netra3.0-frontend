export default function ContactScreen({
  ringOwner,
  ringCooldown,
  seconds,
  goTo,
  contactStatus
}) {
  return (
    <div className="screen active">
      <h3>Contact Owner</h3>

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

      <div className="status success">{contactStatus}</div>
    </div>
  );
}
