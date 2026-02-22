import React from "react";
import { useState, useEffect } from "react";

export default function RegisterScreen({
    form,
    setForm,
    submit
}) {
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if (timer === 0) return;
        const t = setTimeout(() => setTimer(timer - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

    const handle = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const validate = () => {
        if (!form.vehicleNumber.trim())
            return "Vehicle number required";

        if (!/^[A-Za-z0-9]{6,12}$/.test(form.vehicleNumber))
            return "Invalid vehicle number";

        if (!form.ownerName.trim())
            return "Owner name required";

        if (!/^[0-9]{10}$/.test(form.ownerPhone))
            return "Enter valid 10-digit phone";

        if (!form.ownerEmail.trim())
            return "Email required for verification";

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail))
            return "Invalid email address";

        return "";
    };

    // ================= MAIN HANDLER =================
    const handleSubmit = async (resend = false) => {
        const err = validate();
        if (err) return setError(err);

        setError("");

        // RESEND CLICK
        if (resend) return sendOTP();

        // FIRST SEND
        if (!otpSent) return sendOTP();

        // VERIFY
        if (otp.length !== 6)
            return setError("Enter valid 6-digit OTP");

        submit(otp);
    };

    // ================= SEND OTP =================
    const sendOTP = async () => {
        try {
            const res = await fetch("/api/vehicle/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ownerEmail: form.ownerEmail,
                    vehicleNumber: form.vehicleNumber
                })
            });

            const data = await res.json();

            if (!res.ok)
                return setError(data.message || "Failed to send OTP");

            setOtpSent(true);
            setOtp("");
            setTimer(60);

        } catch {
            setError("Network error. Try again.");
        }
    };

    // ================= UI =================
    return (
        <div className="screen active">
            <h3>Register Vehicle</h3>

            <input
                name="vehicleNumber"
                placeholder="Vehicle Number"
                onChange={e =>
                    setForm({
                        ...form,
                        vehicleNumber: e.target.value.toUpperCase()
                    })
                }
            />

            <input
                name="ownerName"
                placeholder="Owner Name"
                onChange={handle}
            />

            <input
                name="ownerPhone"
                placeholder="Phone"
                onChange={handle}
            />

            <input
                name="ownerEmail"
                placeholder="Email"
                onChange={handle}
            />

            {otpSent && (
                <input
                    autoFocus
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                />
            )}

            {otpSent && (
                <button
                    disabled={timer > 0}
                    onClick={() => handleSubmit(true)}
                    className="secondary"
                >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
            )}

            <button
                className="primary"
                onClick={() => handleSubmit(false)}
                disabled={otpSent && otp.length !== 6}
            >
                {otpSent ? "Verify & Register" : "Send OTP"}
            </button>

            {error && <div className="status error">{error}</div>}
        </div>
    );
}