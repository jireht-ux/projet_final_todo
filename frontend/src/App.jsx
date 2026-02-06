import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TacheListe from './components/TacheListe'
import AjoutTacheForm from './components/AjoutTacheForm'
import LoginPage from './components/LoginPage'
import { fetchTaches, addTache, supprimeTache, toggleTache } from './api'

function App() {
  const [taches, setTaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null
    } catch (e) {
      return null
    }
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    fetchTaches(token)
      .then((data) => {
        if (isMounted) setTaches(data)
        if (isMounted) setLoading(false)
        if (isMounted) setIsLoading(false)
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Erreur')
        if (isMounted) setLoading(false)
        if (isMounted) setIsLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token)
      else localStorage.removeItem('token')
    } catch (e) {
      console.warn('localStorage unavailable', e)
    }
  }, [token])

  async function handleAjoutTache(titre) {
    try {
      const nouvelleTache = await addTache(titre, token)
      setTaches((prev) => [...prev, nouvelleTache])
    } catch (err) {
      console.error('Erreur ajout tâche', err)
      setError(err.message || 'Erreur ajout')
    }
  }

  async function handleSupprimeTache(id) {
    try {
      await supprimeTache(id, token)
      setTaches((prev) => prev.filter((t) => (t.id ?? t.pk) !== id))
    } catch (err) {
      console.error('Erreur suppression tâche', err)
      setError(err.message || 'Erreur suppression')
    }
  }

  async function handleToggleTache(id, termine) {
    try {
      const updated = await toggleTache(id, termine, token)
      setTaches((prev) => prev.map((t) => ((t.id ?? t.pk) === id ? updated : t)))
    } catch (err) {
      console.error('Erreur toggle tâche', err)
      setError(err.message || 'Erreur toggle')
    }
  }

  async function handleLogin(username, password) {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status} ${text}`)
      }

      const data = await res.json()
      // expected { token: '...' }
      if (data.token) {
        setToken(data.token)
        // récupérer les tâches immédiatement après connexion
        try {
          fetchTaches(data.token)
            .then((tData) => {
              setTaches(tData)
              setLoading(false)
              setIsLoading(false)
            })
            .catch((err) => {
              console.error('Erreur fetch après login', err)
              setError(err.message || 'Erreur fetch après login')
            })
        } catch (e) {
          console.error('Erreur lancement fetch après login', e)
        }

        return data.token
      }

      throw new Error('No token returned')
    } catch (err) {
      console.error('Erreur login', err)
      setError(err.message || 'Erreur login')
      throw err
    }
  }

  function handleLogout() {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem('token')
    } catch (e) {
      console.warn('localStorage unavailable', e)
    }
    setToken(null)
  }


  if (isLoading) {
    return (
      <div>Chargement...</div>
    )
  }

  if (!token) {
    return (
      <div>
        <h1>Se connecter</h1>
        <LoginPage handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h1>Ma liste de Tâches</h1>
      <button type="button" onClick={handleLogout} style={{ marginLeft: 8 }}>
        Déconnexion
      </button>
      <AjoutTacheForm onAjout={handleAjoutTache} />
      <TacheListe taches={taches} loading={loading} error={error} onSupprime={handleSupprimeTache} handleToggleTache={handleToggleTache} />
    </div>
  )
}

export default App
