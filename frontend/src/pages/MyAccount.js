import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const [user, setUser]         = useState({});
  const [language, setLanguage] = useState('');
  const token                   = localStorage.getItem('token');
  const email                   = localStorage.getItem('email');
  const navigate                = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      navigate('/login');
      return;
    }
    // Obtener los datos del usuario mediante el endpoint de user-crud
    axios.get(`http://localhost:8080/users/email/${email}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
        setLanguage(response.data.language || '');
      })
      .catch(error => {
        console.error(error);
        alert('Error al obtener datos del usuario');
      });
  }, [token, email, navigate]);

  const handleLanguageUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:8082/language/update', { email, language });
      alert(response.data);
      setUser({ ...user, language });
    } catch (error) {
      console.error(error);
      alert('Error actualizando el idioma');
    }
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    try {
      // Construir el objeto de actualización sin el campo "password"
      const updatedUser = {
        name: user.name,
        email: user.email
      };
      const response = await axios.put(`http://localhost:8080/users/${user.id}`, updatedUser, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Cuenta actualizada correctamente');
      setUser(response.data);
    } catch (error) {
      console.error(error);
      alert('Error actualizando la cuenta');
    }
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

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Mi Cuenta</h2>
      <div>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Idioma:</strong> {user.language || 'No especificado'}</p>
      </div>
      <hr />
      <div>
        <h3>Actualizar Idioma</h3>
        <form onSubmit={handleLanguageUpdate}>
          <input 
            type="text" 
            placeholder="Ingrese idioma (ej. es, en)" 
            value={language} 
            onChange={e => setLanguage(e.target.value)} 
          />
          <button type="submit">Actualizar Idioma</button>
        </form>
      </div>
      <hr />
      <div>
        <h3>Actualizar Datos de la Cuenta</h3>
        <form onSubmit={handleAccountUpdate}>
          <div>
            <label>Nombre:</label><br />
            <input 
              type="text" 
              value={user.name || ''} 
              onChange={e => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <button type="submit">Actualizar Cuenta</button>
        </form>
      </div>
      <hr />
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default MyAccount;
