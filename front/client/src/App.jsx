import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IdlePage from "./IdlePage";
import Login from "./Login";
import MainPage from "./DummyMainPage";
import CameraPage from "./cameraApp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IdlePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </Router>
  );
}
