// src/IdlePage.jsx
import React from "react";
import "./login.css";

export default function IdlePage(){
    return (
        <div className="login-container">
            <div className="login-header">
                <div className="time">{formattedTime}</div>
                <div className="date">{formattedDate}</div>
            </div>
        </div>
    );
}