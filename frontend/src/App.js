import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyAccount from './pages/MyAccount';
import RegisterDevice from './pages/RegisterDevice'; 
import Panic from './pages/Panic'; 
import DeviceHome from './pages/DeviceHome';
import Streaming from './pages/Streaming'; //

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
        <Route path="/device/:deviceId" element={<DeviceHome />} />
        <Route path="/streaming" element={<Streaming />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
