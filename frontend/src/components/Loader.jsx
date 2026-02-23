import React from "react";

import "../styles/Loader.css";
import logo from "../assets/connect_img.png";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader">

        <div className="ring ring1"></div>
        <div className="ring ring2"></div>
        <div className="ring ring3"></div>

        <img src="https://i.ibb.co/2Ys94pRD/connect-img.png" alt="Loading..." className="loader-img" />

      </div>

      <div className="loader-text">
        Connecting securely...
      </div>
    </div>
  );
}