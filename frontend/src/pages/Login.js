import React, { useState } from 'react';
import { login } from '../services/authService'; // Importamos la función login desde authService.js
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // Estado para el mensaje de error
  const navigate                = useNavigate(); // Usamos useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Limpiar mensaje de error previo
    try {
      // Usamos la función login del servicio authService
      const response = await login(email, password);
      const { token } = response.data;
      
      // Guardar el token y el email en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);

      // Registrar la sesión en session-api (se simula con IP fija)
      await axios.post(
        'http://localhost:8082/session/login',
        { email, ip: '127.0.0.1' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      navigate('/home'); // Redirigir a la página de Mi Cuenta
    } catch (error) {
      // En lugar de console.error y alert, se muestra un mensaje de error en rojo
      setErrorMsg('Credenciales incorrectas. Verifica tus datos.');
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {/* Mostrar mensaje de error en rojo si existe */}
      {errorMsg && <p style={{ color: 'red', fontSize: '0.9em' }}>{errorMsg}</p>}
      <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
};

export default Login;
