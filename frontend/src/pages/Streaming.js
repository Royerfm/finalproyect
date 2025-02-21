import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Streaming = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const rtspUrl = params.get('rtsp_url');
  const deviceId = params.get('deviceId'); // Recuperar ID del dispositivo para volver

  if (!rtspUrl) {
    return <p>Error: No se proporcionó una URL de streaming.</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Streaming en Vivo</h2>
      <p><strong>Fuente:</strong> {rtspUrl}</p>
      <video src={rtspUrl} controls autoPlay style={{ width: '100%', maxHeight: '500px' }} />

      {/* Botón para regresar a DeviceHome */}
      <button 
        onClick={() => navigate(`/device/${deviceId}`)} // 👈 Volver a DeviceHome con el mismo ID
        style={{
          marginTop: '1rem', 
          background: 'gray', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          cursor: 'pointer'
        }}
      >
        Volver a Dispositivo
      </button>
    </div>
  );
};

export default Streaming;
