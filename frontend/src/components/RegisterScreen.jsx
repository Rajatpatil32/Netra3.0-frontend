import React from "react";
import { useState } from "react";

export default function RegisterScreen({
    form,
    setForm,
    submit
}) {
    const [error, setError] = useState("");

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

        if (
            form.ownerEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)
        )
            return "Invalid email address";

        return "";
    };

    const handleSubmit = () => {
        const err = validate();
        if (err) return setError(err);

        setError("");
        submit();
    };

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
                placeholder="Email (optional)"
                onChange={handle}
            />

            <button className="primary" onClick={handleSubmit}>
                Register
            </button>

            {error && <div className="status error">{error}</div>}
        </div>
    );
}