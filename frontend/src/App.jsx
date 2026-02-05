import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TacheListe from './components/TacheListe'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Ma liste de Tâches</h1>
      <TacheListe />
    </div>
  )
}

export default App
