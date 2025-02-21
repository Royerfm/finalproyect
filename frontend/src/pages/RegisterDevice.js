import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterDevice = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  const [device, setDevice] = useState({
    serial_number: '',
    user_device: '',
    password_device: '',
    name_device: '',
    ip_address: '',
    rtsp_port: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setDevice(prevDevice => ({
      ...prevDevice,
      [name]: name === "rtsp_port" ? Number(value) || 0 : value // Convertir rtsp_port a número, evitar valores no numéricos
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    const requestData = {
      ...device,
      email_user: email // Asociamos el email del usuario autenticado
    };
  
  
    try {
      const response = await axios.post(
        'http://localhost:8084/devices',
        requestData,
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }
      );
  
      if (response.status === 201) {
        navigate('/home'); // Redirige a Home después del registro exitoso
      }
    } catch (error) {
      console.error('❌ Error al registrar dispositivo:', error);
      setErrorMessage('No se pudo registrar el dispositivo. Verifica los datos.');
    }
  };
  

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Registrar Nuevo Dispositivo</h2>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input type="text" name="serial_number" placeholder="Número de serie (Opcional)" value={device.serial_number} onChange={handleChange} />
        <input type="text" name="user_device" placeholder="Usuario del dispositivo" required value={device.user_device} onChange={handleChange} />
        <input type="password" name="password_device" placeholder="Contraseña del dispositivo" required value={device.password_device} onChange={handleChange} />
        <input type="text" name="name_device" placeholder="Nombre del dispositivo (Opcional)" value={device.name_device} onChange={handleChange} />
        <input type="text" name="ip_address" placeholder="Dirección IP" required value={device.ip_address} onChange={handleChange} />
        <input type="number" name="rtsp_port" placeholder="Puerto RTSP (554 default)" required value={device.rtsp_port} onChange={handleChange} />

        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Guardar Dispositivo
        </button>
      </form>

      <button onClick={() => navigate('/home')} style={{ marginTop: '1rem', background: 'gray', color: 'white', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Volver
      </button>
    </div>
  );
};

export default RegisterDevice;
