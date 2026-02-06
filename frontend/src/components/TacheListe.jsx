import React from 'react';
import TacheItem from './TacheItem';

export default function TacheListe({ taches = [], onSupprime, handleToggleTache, loading, error }) {

  if (!taches || taches.length === 0) return (
    <ul>
      <li>Aucune tâche</li>
    </ul>
  );

  return (
    <ul>
      {taches.map((t) => (
        <TacheItem
          key={t.id ?? t.pk ?? JSON.stringify(t)}
          tache={t}
          onSupprime={onSupprime}
          handleToggleTache={handleToggleTache}
        />
      ))}
    </ul>
  );
}
