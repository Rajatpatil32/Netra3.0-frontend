export default function PhoneScreen({
  phone,
  setPhone,
  verifyPhone,
  phoneStatus
}) {
  return (
    <div className="screen active">
      <h3>Your Phone Number</h3>

      <input
        type="tel"
        maxLength="10"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        placeholder="Enter 10-digit mobile number"
      />

      <button className="primary" onClick={verifyPhone}>
        Continue
      </button>

      <div className="status error">{phoneStatus}</div>
    </div>
  );
}
