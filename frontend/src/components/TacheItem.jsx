import React from 'react';

export default function TacheItem({ tache, onSupprime, handleToggleTache }) {
  if (!tache) return (
    <li>—</li>
  );

  const id = tache.id ?? tache.pk

  const termine = tache.termine ?? false

  return (
    <li>
      <input
        type="checkbox"
        checked={!!termine}
        onChange={() => handleToggleTache && handleToggleTache(id, termine)}
        style={{ marginRight: 8 }}
      />
      {tache.titre ?? tache.nom ?? JSON.stringify(tache)}
      <button type="button" onClick={() => onSupprime && onSupprime(id)} style={{ marginLeft: 8 }}>
        Supprimer
      </button>
    </li>
  );
}
