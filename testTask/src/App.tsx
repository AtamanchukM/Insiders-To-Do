import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              <Header />
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
