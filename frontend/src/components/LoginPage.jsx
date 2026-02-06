import React, { useState } from 'react';

export default function LoginPage({ onLogin, handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof handleLogin === 'function') {
      // prefer explicit handleLogin prop: (username, password)
      handleLogin(username.trim(), password);
      return;
    }
    if (typeof onLogin === 'function') {
      // backward-compatible shape
      onLogin({ username: username.trim(), password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nom d'utilisateur
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Se connecter</button>
    </form>
  );
}
