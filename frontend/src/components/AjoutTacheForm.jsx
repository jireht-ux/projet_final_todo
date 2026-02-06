import React, { useState } from 'react';

export default function AjoutTacheForm({ onAjout }) {
  const [titre, setTitre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titre.trim()) return;
    if (typeof onAjout === 'function') {
      onAjout(titre.trim());
    }
    setTitre('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}
