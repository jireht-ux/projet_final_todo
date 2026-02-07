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
  const [reportTaskId, setReportTaskId] = useState(null)
  const [reportStatus, setReportStatus] = useState('')

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

  // Polling effect to check report status when a task id is set
  useEffect(() => {
    if (!reportTaskId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/taches/check-report-status/${reportTaskId}/`, {
          headers: token ? { Authorization: `Token ${token}` } : {}
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status} ${text}`)
        }
        const data = await res.json()
        setReportStatus(data)
        if (data.state === 'SUCCESS' || data.state === 'FAILURE') {
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Erreur check report status', err)
        setReportStatus(err.message || 'Erreur check status')
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [reportTaskId])

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

  async function handleStartReport() {
    try {
      const res = await fetch('http://127.0.0.1:8000/taches/start-report/', {
        method: 'POST',
        headers: token ? { Authorization: `Token ${token}` } : {}
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status} ${text}`)
      }
      const data = await res.json()
      setReportTaskId(data.task_id)
      setReportStatus('Démarré')
    } catch (err) {
      console.error('Erreur démarrage rapport', err)
      setReportStatus(err.message || 'Erreur démarrage rapport')
    }
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
      <button type="button" onClick={handleStartReport} style={{ marginLeft: 8 }}>
        Générer un Rapport
      </button>
      {reportTaskId && (
        <div style={{ marginTop: 8 }}>
          <strong>Report Task ID:</strong> {reportTaskId}
        </div>
      )}
      {reportStatus && (
        <div style={{ marginTop: 8 }}>
          <strong>Statut du rapport:</strong> {typeof reportStatus === 'string' ? reportStatus : JSON.stringify(reportStatus)}
        </div>
      )}
      <AjoutTacheForm onAjout={handleAjoutTache} />
      <TacheListe taches={taches} loading={loading} error={error} onSupprime={handleSupprimeTache} handleToggleTache={handleToggleTache} />
    </div>
  )
}

export default App
