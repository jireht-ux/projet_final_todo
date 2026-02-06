import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TacheListe from './components/TacheListe'
import AjoutTacheForm from './components/AjoutTacheForm'
import { fetchTaches, addTache, supprimeTache, toggleTache } from './api'

function App() {
  const [taches, setTaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    fetchTaches()
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

  async function handleAjoutTache(titre) {
    try {
      const nouvelleTache = await addTache(titre)
      setTaches((prev) => [...prev, nouvelleTache])
    } catch (err) {
      console.error('Erreur ajout tâche', err)
      setError(err.message || 'Erreur ajout')
    }
  }

  async function handleSupprimeTache(id) {
    try {
      await supprimeTache(id)
      setTaches((prev) => prev.filter((t) => (t.id ?? t.pk) !== id))
    } catch (err) {
      console.error('Erreur suppression tâche', err)
      setError(err.message || 'Erreur suppression')
    }
  }

  async function handleToggleTache(id, termine) {
    try {
      const updated = await toggleTache(id, termine)
      setTaches((prev) => prev.map((t) => ((t.id ?? t.pk) === id ? updated : t)))
    } catch (err) {
      console.error('Erreur toggle tâche', err)
      setError(err.message || 'Erreur toggle')
    }
  }


  if (isLoading) {
    return (
      <div>Chargement...</div>
    )
  }

  return (
    <div>
      <h1>Ma liste de Tâches</h1>
      <AjoutTacheForm onAjout={handleAjoutTache} />
      <TacheListe taches={taches} loading={loading} error={error} onSupprime={handleSupprimeTache} handleToggleTache={handleToggleTache} />
    </div>
  )
}

export default App
