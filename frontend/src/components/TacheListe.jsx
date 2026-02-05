import React, { useState, useEffect } from 'react';

export default function TacheListe() {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch('http://127.0.0.1:8000/taches/api/taches/', {
      headers: {
        'Authorization': 'Token 557576aa49e05ee8bf268fcafc9528c14fb35f37'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) setTaches(data);
        if (isMounted) setLoading(false);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Erreur');
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) return <div>Erreur: {error}</div>;
  if (loading) return (
    <ul>
      <li>Chargement...</li>
    </ul>
  );

  return (
    <ul>
      {taches.map((t) => (
        <li key={t.id || t.pk}>{t.titre || t.nom || JSON.stringify(t)}</li>
      ))}
    </ul>
  );
}
