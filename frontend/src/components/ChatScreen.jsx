export default function ChatScreen({
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
  chatDisabled
}) {
  return (
    <div className="screen active">
      <h3>Private Chat</h3>

      <div className="chat-box">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.system ? "" : "sent"}`}
          >
            {msg.text}

            {!msg.system && (
              <div className="time">
                {msg.time} • ✓✓ Delivered
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        disabled={chatDisabled}
        placeholder="Type message..."
      />

      <button
        className="primary"
        onClick={sendMessage}
        disabled={!chatInput.trim() || chatDisabled}
      >
        Send
      </button>
    </div>
  );
}
