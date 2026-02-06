const API_BASE = 'http://127.0.0.1:8000'
const AUTH_HEADER = { 'Authorization': 'Token 557576aa49e05ee8bf268fcafc9528c14fb35f37' }

export async function fetchTaches() {
  const res = await fetch(`${API_BASE}/taches/api/taches/`, { headers: AUTH_HEADER })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function addTache(titre) {
  const res = await fetch(`${API_BASE}/taches/api/taches/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
    body: JSON.stringify({ titre })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function supprimeTache(id) {
  const res = await fetch(`${API_BASE}/taches/api/taches/${id}/`, {
    method: 'DELETE',
    headers: AUTH_HEADER
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

export async function toggleTache(id, termine) {
  const res = await fetch(`${API_BASE}/taches/api/taches/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
    body: JSON.stringify({ termine: !termine })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
