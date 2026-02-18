import { useState, useEffect, useRef } from "react";
import "./styles/App.css";

import {
  fetchVehicleByQR,
  verifyVehicleNumber,
  verifyVisitorPhone,
  sendRingRequest,
  sendEmergencyAlert
} from "./api/vehicleApi";

import BackButton from "./components/BackButton";
import VehicleScreen from "./components/VehicleScreen";
import PhoneScreen from "./components/PhoneScreen";
import ContactScreen from "./components/ContactScreen";
import ChatScreen from "./components/ChatScreen";
import EmergencyScreen from "./components/EmergencyScreen";

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

  const chatExpireRef = useRef(null);

  useEffect(() => {
    async function loadVehicle() {
      const res = await fetchVehicleByQR("demoQR");
      setVehicleData(res.data);
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

  const handleVerifyVehicle = async () => {
    try {
      await verifyVehicleNumber(vehicleData.qrId, vehicleInput);
      setVehicleStatus("");
      goTo("phone");
    } catch {
      setVehicleStatus("Vehicle number does not match.");
    }
  };

  const handleVerifyPhone = async () => {
    try {
      await verifyVisitorPhone(phone);
      setPhoneStatus("");
      goTo("contact");
    } catch {
      setPhoneStatus("Enter valid phone number.");
    }
  };

  const ringOwner = async () => {
    if (ringCooldown) return;

    await sendRingRequest();

    // Get existing history
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
  };


  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setChatMessages((prev) => [
      ...prev,
      { text: chatInput, time }
    ]);

    setChatInput("");
  };

  const startChatTimer = () => {
    if (chatExpireRef.current) clearTimeout(chatExpireRef.current);

    chatExpireRef.current = setTimeout(() => {
      setChatDisabled(true);
      setChatMessages((prev) => [
        ...prev,
        { text: "Chat expired for privacy.", system: true }
      ]);
    }, 20 * 60 * 1000);
  };

  const handlePhoto = (file) => {
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const submitEmergency = async () => {
    if (!photoPreview)
      return setEmergencyStatus("Please capture/upload a photo.");

    if (!emergencyMessage.trim())
      return setEmergencyStatus("Please enter emergency message.");

    await sendEmergencyAlert({
      vehicle: vehicleData.vehicleNumber,
      message: emergencyMessage,
      photo: photoPreview
    });

    setEmergencyStatus("Emergency alert sent successfully.");
  };

  return (
    <div className="container">
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

      </div>

      <div className="footer">
        Want your own QR for vehicle?{" "}
        <a href="mailto:yourmail@example.com">Click here</a>
      </div>
    </div>
  );
}
