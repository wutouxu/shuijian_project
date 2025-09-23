
import React, { useState } from 'react';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch('/api/login?username=' + username + '&password=' + password, {
      method: 'GET',
    })
    .then(res => res.text())
    .then(response => {
      if (response === "Login Successful!") {
        onLoginSuccess();
      } else {
        alert("Invalid credentials!");
      }
    });
  };


  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login+++</button>
    </div>
  );
}

export default LoginPage;
