// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  const [userName, setUserName] = useState('');
  const [devices, setDevices] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      navigate('/login');
      return;
    }
    // Obtener la información del usuario para mostrar el nombre
    axios.get(`http://localhost:8080/users/email/${email}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setUserName(response.data.name);
      })
      .catch(error => {
        console.error('Error al obtener el usuario:', error);
      });

    // Obtener los dispositivos vinculados al usuario (endpoint placeholder)
    axios.get(`http://localhost:8080/devices?email=${email}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setDevices(response.data);
      })
      .catch(error => {
        console.error('Error al obtener dispositivos:', error);
        setDevices([]);
      });
  }, [email, token, navigate]);

  const handleMiCuentaClick = () => {
    // Alterna la visibilidad del menú
    setShowAccountMenu(!showAccountMenu);
  };

  const handleEditar = () => {
    setShowAccountMenu(false);
    navigate('/myaccount');
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8082/session/logout', { email });
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleRegisterDevice = () => {
    navigate('/registerdevice');
  };

  const handlePanico = () => {
    navigate('/panic'); // Placeholder para el microservicio de pánico
  };

  return (
    <div>
      {/* Encabezado */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        position: 'relative'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Hola, {userName}
        </div>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={handleMiCuentaClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'blue',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Mi cuenta
          </button>
          {showAccountMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              marginTop: '0.5rem',
              background: 'white',
              border: '1px solid #ccc',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
              zIndex: 1000,
              borderRadius: '4px',
              minWidth: '150px'
            }}>
              <div 
                onClick={handleEditar}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
              >
                Editar
              </div>
              <div 
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                Cerrar Sesión
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cuerpo */}
      <main style={{ padding: '1rem' }}>
        {/* Sección de dispositivos */}
        <section style={{ marginBottom: '2rem' }}>
          <h3>Mis Dispositivos</h3>
          {devices.length === 0 ? (
            <p>No existen dispositivos</p>
          ) : (
            <ul>
              {devices.map(device => (
                <li key={device.id}>{device.name}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Sección para agregar un nuevo dispositivo */}
        <section style={{ marginBottom: '2rem' }}>
          <button onClick={handleRegisterDevice} style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Agregar Nuevo Dispositivo
          </button>
        </section>
      </main>

      {/* Botón "Pánico" en la parte inferior centrado */}
      <footer style={{
        position: 'fixed',
        bottom: '1rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button onClick={handlePanico} style={{
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          background: 'red',
          color: 'white',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer'
        }}>
          Pánico
        </button>
      </footer>
    </div>
  );
};

export default Home;
