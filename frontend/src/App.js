import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyAccount from './pages/MyAccount';
import RegisterDevice from './pages/RegisterDevice'; // Placeholder
import Panic from './pages/Panic'; // Placeholder

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/registerdevice" element={<RegisterDevice />} />
        <Route path="/panic" element={<Panic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
