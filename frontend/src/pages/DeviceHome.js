import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeviceHome = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const [device, setDevice] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (!token || !email) {
      navigate('/home');
      return;
    }

    // Obtener el dispositivo
    axios.get(`http://localhost:8084/devices/user?email=${email}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (!Array.isArray(response.data)) {
          setError('Error al obtener la lista de dispositivos.');
          return;
        }

        const foundDevice = response.data.find(d => String(d.id) === String(deviceId));

        if (foundDevice) {
          setDevice(foundDevice);
          // Obtener rutas de video del dispositivo (microservicio futuro)
         
          fetchRTSPUrl(foundDevice.id);
        } else {
          setError("No tienes acceso a este dispositivo o no existe.");
        }
      })
      .catch(error => {
        console.error('Error al obtener dispositivos del usuario:', error);
        setError('No se pudo cargar la información del dispositivo.');
      });
  }, [deviceId, email, token, navigate]);

  const fetchDeviceRoutes = (rtspUrl) => {
    if (!rtspUrl || rtspUrl === "No disponible") {
      console.error("❌ No hay URL RTSP disponible para escanear canales.");
      setRoutes([]);
      return;
    }
  
    axios.post("http://localhost:8086/scan", { rtsp_url: rtspUrl }, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (Array.isArray(response.data.routes)) {
        setRoutes(response.data.routes);
      } else {
        console.error("⚠️ La respuesta del API no es un array válido:", response.data);
        setRoutes([]);
      }
    })
    .catch(error => {
      console.error('❌ Error al obtener rutas del dispositivo:', error);
      setRoutes([]);
    });
  };
  

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const fetchRTSPUrl = (deviceId) => {
    axios.get(`http://localhost:8085/rtsp/${deviceId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      setRtspUrl(response.data.rtsp_url);
      fetchDeviceRoutes(response.data.rtsp_url);
    })
    .catch(error => {
      console.error('Error al obtener la URL RTSP:', error);
      setRtspUrl('No disponible');
      setRoutes([]);
    });
  };
  

  const handleDeleteDevice = () => {
    if (!deviceId || deviceId === "undefined") {
      setError("ID del dispositivo no válido.");
      return;
    }
  
    axios.delete(`http://localhost:8084/devices/${deviceId}?email=${email}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        navigate('/home');
      })
      .catch(error => {
        console.error('Error al eliminar el dispositivo:', error);
        setError('No se pudo eliminar el dispositivo.');
      });
  };

  const handleSaveChanges = () => {
    if (!deviceId || deviceId === "undefined") {
      setError("ID del dispositivo no válido.");
      return;
    }
  
    axios.put(`http://localhost:8084/devices/${deviceId}?email=${email}`, device, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error al actualizar el dispositivo:', error);
        setError('No se pudo actualizar el dispositivo.');
      });
  };

  if (error) {
    return (
      <div style={{ padding: '1rem', color: 'red' }}>
        <p>{error}</p>
        <button onClick={() => navigate('/home')} style={{ background: 'gray', color: 'white', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Volver
        </button>
      </div>
    );
  }

  if (!device) {
    return <p style={{ padding: '1rem' }}>Cargando...</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Encabezado con el nombre del dispositivo y botón de edición */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>{device.name_device || "Dispositivo sin nombre"}</h2>
        <button onClick={handleEditToggle} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue', fontSize: '1rem' }}>
          {editMode ? "Cancelar Edición" : "Editar Dispositivo"}
        </button>
      </header>

      {/* Formulario de edición */}
      {editMode ? (
        <div>
          <input type="text" placeholder="Nombre del dispositivo" value={device.name_device || ''} onChange={(e) => setDevice({ ...device, name_device: e.target.value })} />
          <input type="text" placeholder="Dirección IP" value={device.ip_address} onChange={(e) => setDevice({ ...device, ip_address: e.target.value })} />
          <input type="number" placeholder="Puerto RTSP" value={device.rtsp_port} onChange={(e) => setDevice({ ...device, rtsp_port: Number(e.target.value) })} />
          <input type="text" placeholder="Usuario del dispositivo" value={device.user_device} onChange={(e) => setDevice({ ...device, user_device: e.target.value })} />
          <input type="password" placeholder="Contraseña" value={device.password_device} onChange={(e) => setDevice({ ...device, password_device: e.target.value })} />

          <button onClick={handleSaveChanges} style={{ background: 'green', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>Guardar Cambios</button>
          <button onClick={handleDeleteConfirm} style={{ background: 'red', color: 'white', padding: '0.5rem', cursor: 'pointer', marginLeft: '10px' }}>Eliminar Dispositivo</button>
        </div>
      ) : (
        <div>
          <p><strong>Dirección IP:</strong> {device.ip_address}</p>
          <p><strong>Puerto RTSP:</strong> {device.rtsp_port}</p>
          <p><strong>Usuario del Dispositivo:</strong> {device.user_device}</p>
          
        </div>
      )}

      {/* Sección de rutas de video */}
      
      <section style={{ marginTop: '1rem' }}>
        <h3>Rutas de Video</h3>
        {routes.length === 0 ? (
            <p>No hay rutas disponibles.</p>
        ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {routes.map((route, index) => {
                // Generar correctamente la URL RTSP basada en el formato correcto del DVR
                const correctedRtspUrl = `rtsp://admin:redu1828@192.168.100.39:554/cam/realmonitor?channel=${index + 1}&subtype=0`;

                // Codificar la URL RTSP antes de enviarla al API
                const encodedRtspUrl = encodeURIComponent(correctedRtspUrl);
                const snapshotUrl = `http://localhost:8087/snapshot?rtsp_url=${encodedRtspUrl}`;

                return (
                <div key={index} style={{ width: '250px', textAlign: 'center', border: '1px solid #ddd', padding: '8px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <p><strong>Ruta {index + 1}</strong></p>
                    <img 
                    src={snapshotUrl} 
                    alt={`Snapshot de la ruta ${index + 1}`} 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px' }} 
                    onClick={() => navigate(`/streaming?rtsp_url=${encodedRtspUrl}&deviceId=${device.id}`)} 
                    />
                </div>
                );
            })}
            </div>
        )}
        </section>





      {/* Botón de volver */}
      <button onClick={() => navigate('/home')} style={{ marginTop: '1rem', background: 'gray', color: 'white', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Volver
      </button>

      {/* Ventana de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          <p>¿Seguro que quiere eliminar este dispositivo?</p>
          <button onClick={handleDeleteDevice} style={{ background: 'red', color: 'white', padding: '0.5rem', cursor: 'pointer', marginRight: '10px' }}>Sí</button>
          <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'gray', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>No</button>
        </div>
      )}
    </div>
  );
};

export default DeviceHome;
