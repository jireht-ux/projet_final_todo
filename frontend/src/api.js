const API_BASE = 'http://127.0.0.1:8000'

function authHeader(token) {
  let t = token
  try {
    if (!t && typeof localStorage !== 'undefined') {
      t = localStorage.getItem('token')
    }
  } catch (e) {
    // localStorage not available (e.g., server-side); ignore
  }
  return t ? { Authorization: `Token ${t}` } : {}
}

export async function fetchTaches(token) {
  const headers = { ...authHeader(token) }
  const res = await fetch(`${API_BASE}/taches/api/taches/`, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function addTache(titre, token) {
  const headers = { 'Content-Type': 'application/json', ...authHeader(token) }
  const res = await fetch(`${API_BASE}/taches/api/taches/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ titre })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function supprimeTache(id, token) {
  const res = await fetch(`${API_BASE}/taches/api/taches/${id}/`, {
    method: 'DELETE',
    headers: authHeader(token)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

export async function toggleTache(id, termine, token) {
  const headers = { 'Content-Type': 'application/json', ...authHeader(token) }
  const res = await fetch(`${API_BASE}/taches/api/taches/${id}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ termine: !termine })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
