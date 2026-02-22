import React from "react";
import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import logo from "./connect_img.png";

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

  const qrId = new URLSearchParams(window.location.search).get("qr");
  useEffect(() => {
    async function loadVehicle() {
      console.log("useEffect started");

      try {
        const res = await fetchVehicleByQR(qrId);
        setVehicleData(res.data);
      } catch (err) {
        console.error("API error:", err);
        setScreen("register");
      }
    }

    loadVehicle();
  }, []);

  if (!vehicleData && screen !== "register")
    return <div className="loader">Loading...</div>;

  const blurredQR =
    vehicleData?.vehicleNumber?.substring(0, 4) +
    "**" +
    vehicleData?.vehicleNumber?.substring(6);

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

  const handleRegister = async (otp) => {
    try {
      const res = await registerVehicle({
        qrId,
        otp,
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
        {screen === "register" && (
          <RegisterScreen
            form={registerData}
            setForm={setRegisterData}
            submit={handleRegister}
          />
        )}

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
            ownerPhone={vehicleData.ownerPhone}
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
        <div className="contact-icons">

          <a href="https://wa.me/8370060350?text=Hello%2C%20I%27m%20interested%20in%20Smart%20Contact%20QR%20from%20your%20website.%20Please%20share%20details."
            target="_blank"
            className="icon whatsapp">

            <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
              <path d="M20.52 3.48A11.82 11.82 0 0012.03 0C5.4 0 .04 5.36.04 11.99c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.61a11.94 11.94 0 005.86 1.5h.01c6.63 0 11.99-5.36 11.99-11.99 0-3.2-1.25-6.21-3.51-8.42zm-8.49 18.3h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.66.96.98-3.57-.24-.37a9.89 9.89 0 01-1.52-5.26C2.18 6.48 6.52 2.14 12.03 2.14c2.63 0 5.1 1.03 6.96 2.9a9.78 9.78 0 012.89 6.96c0 5.51-4.34 9.85-9.85 9.85zm5.41-7.38c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.51-1.8-1.69-2.1-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
            </svg>

          </a>


          <a href="mailto:biz@netraa.co.in?subject=Inquiry%20About%20Smart%20Contact%20QR&body=Hello,%20I%27m%20interested%20in%20Smart%20Contact%20QR%20from%20your%20website.%20Please%20share%20details."
            className="icon email">

            <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
              <path d="M12 13.5L0 6.75V18h24V6.75L12 13.5zM12 11L24 4H0l12 7z" />
            </svg>

          </a>

        </div>
      </div>
    </div>
  );
}