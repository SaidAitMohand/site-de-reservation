import { Routes, Route } from 'react-router-dom'
import Home from './pages/index'
import Admin from './pages/apiAdmin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
