import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import logo from "../img/connect_img.png";

import {
  fetchVehicleByQR,
  sendRingRequest,
  sendEmergencyAlert
} from "./api/vehicleApi";

import BackButton from "./components/BackButton";
import VehicleScreen from "./components/VehicleScreen";
import PhoneScreen from "./components/PhoneScreen";
import ContactScreen from "./components/ContactScreen";
import ChatScreen from "./components/ChatScreen";
import EmergencyScreen from "./components/EmergencyScreen";
import { registerVehicle } from "./api/vehicleApi";
import RegisterScreen from "./components/RegisterScreen";

export default function App() {

  const [screen, setScreen] = useState("vehicle");
  const [vehicleData, setVehicleData] = useState(null);

  const [vehicleInput, setVehicleInput] = useState("");
  const [phone, setPhone] = useState("");

  const [vehicleStatus, setVehicleStatus] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");
  const [contactStatus, setContactStatus] = useState("");

  const [ringCooldown, setRingCooldown] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatDisabled, setChatDisabled] = useState(false);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [emergencyStatus, setEmergencyStatus] = useState("");


  const [registerData, setRegisterData] = useState({
    vehicleNumber: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: ""
  });

  const chatExpireRef = useRef(null);

  useEffect(() => {
  async function loadVehicle() {
    console.log("useEffect started");

    try {
      console.log("calling API...");
      const res = await fetchVehicleByQR("demoQR");

      console.log("API response:", res);

      setVehicleData(res.data);
    } catch (err) {
      console.error("API error:", err);
      setScreen("register");
    }
  }

  loadVehicle();
}, []);

  if (!vehicleData) return null;

  const blurredQR =
    vehicleData.vehicleNumber.substring(0, 4) +
    "**" +
    vehicleData.vehicleNumber.substring(6);

  const goTo = (id) => {
    setScreen(id);
    if (id === "chat") startChatTimer();
  };

  const goBack = () => {
    if (screen === "phone") setScreen("vehicle");
    else if (screen === "contact") setScreen("phone");
    else if (screen === "chat") setScreen("contact");
    else if (screen === "emergency") setScreen("contact");
  };

  const handleRegister = async () => {
    try {
      const res = await registerVehicle({
        qrId: "demoQR",
        ...registerData
      });

      setVehicleData(res.data);
      setScreen("vehicle");

    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= VEHICLE VERIFY ================= */

  const handleVerifyVehicle = () => {
    if (
      vehicleInput.trim().toUpperCase() ===
      vehicleData.vehicleNumber.toUpperCase()
    ) {
      setVehicleStatus("");
      goTo("phone");
    } else {
      setVehicleStatus("Vehicle number does not match.");
    }
  };

  /* ================= PHONE VERIFY ================= */

  const handleVerifyPhone = () => {
    if (phone.length === 10) {
      setPhoneStatus("");
      goTo("contact");
    } else {
      setPhoneStatus("Enter valid phone number.");
    }
  };

  /* ================= RING OWNER ================= */

  const ringOwner = async (message) => {
    if (ringCooldown) return;

    try {
      await sendRingRequest({
        qrId: vehicleData.qrId,
        visitorPhone: phone,
        message: message
      });

      const ringHistory =
        JSON.parse(localStorage.getItem("ringHistory")) || [];

      const newRing = {
        time: new Date().toLocaleString(),
        responded: false
      };

      ringHistory.push(newRing);
      localStorage.setItem("ringHistory", JSON.stringify(ringHistory));

      setRingCooldown(true);
      setContactStatus("Ring sent. Owner notified.");

      let count = 60;
      const interval = setInterval(() => {
        count--;
        setSeconds(count);

        if (count === 0) {
          clearInterval(interval);
          setRingCooldown(false);
          setSeconds(60);
          setContactStatus("");
        }
      }, 1000);

    } catch (err) {
      setContactStatus(err.message);
    }
  };

  /* ================= CHAT ================= */

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setChatMessages(prev => [
      ...prev,
      { text: chatInput, time }
    ]);

    setChatInput("");
  };

  const startChatTimer = () => {
    if (chatExpireRef.current) clearTimeout(chatExpireRef.current);

    chatExpireRef.current = setTimeout(() => {
      setChatDisabled(true);
      setChatMessages(prev => [
        ...prev,
        { text: "Chat expired for privacy.", system: true }
      ]);
    }, 20 * 60 * 1000);
  };

  /* ================= PHOTO ================= */

  const handlePhoto = (file) => {
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= EMERGENCY ================= */

  const submitEmergency = async () => {
    if (!photoPreview)
      return setEmergencyStatus("Please capture/upload a photo.");

    if (!emergencyMessage.trim())
      return setEmergencyStatus("Please enter emergency message.");

    try {
      await sendEmergencyAlert({
        qrId: vehicleData.qrId,
        visitorPhone: phone,
        message: emergencyMessage,
        photo: photoPreview
      });

      setEmergencyStatus("Emergency alert sent successfully.");
    } catch (err) {
      setEmergencyStatus(err.message);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container">
      <img src={logo} alt="logo" className="app-logo" />
      <div className="card">

        {screen !== "vehicle" && <BackButton onClick={goBack} />}

        {screen === "vehicle" && (
          <VehicleScreen
            blurredQR={blurredQR}
            vehicleInput={vehicleInput}
            setVehicleInput={setVehicleInput}
            verifyVehicle={handleVerifyVehicle}
            vehicleStatus={vehicleStatus}
          />
        )}

        {screen === "phone" && (
          <PhoneScreen
            phone={phone}
            setPhone={setPhone}
            verifyPhone={handleVerifyPhone}
            phoneStatus={phoneStatus}
          />
        )}

        {screen === "contact" && (
          <ContactScreen
            ringOwner={ringOwner}
            ringCooldown={ringCooldown}
            seconds={seconds}
            goTo={goTo}
            contactStatus={contactStatus}
          />
        )}

        {screen === "chat" && (
          <ChatScreen
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendMessage={sendMessage}
            chatDisabled={chatDisabled}
          />
        )}

        {screen === "emergency" && (
          <EmergencyScreen
            handlePhoto={handlePhoto}
            photoPreview={photoPreview}
            emergencyMessage={emergencyMessage}
            setEmergencyMessage={setEmergencyMessage}
            submitEmergency={submitEmergency}
            emergencyStatus={emergencyStatus}
          />
        )}

        {screen === "register" && (
          <RegisterScreen
            form={registerData}
            setForm={setRegisterData}
            submit={handleRegister}
          />
        )}

      </div>

      <div className="footer">
        Want your own QR for vehicle?{" "}
        <a href="mailto:yourmail@example.com">Click here</a>
      </div>
    </div>
  );
}