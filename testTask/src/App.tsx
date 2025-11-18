import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ProtectedRoute from "./routes/ProtectedRout"

import Login from './pages/Login'
import Register from './pages/Register'
import TodoList from './pages/TodoList'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todo" element={<ProtectedRoute><TodoList /></ProtectedRoute>} />
        <Route path="*" element={<Login />} />

      </Routes>
    </Router>
  )
}
