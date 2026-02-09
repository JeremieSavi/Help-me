// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/common/Landing'; // Importe la Landing Page
import Signup from './pages/common/Signup';
import Login from './pages/common/Login';
import Dashboard from './pages/Dashboard';

// Importe les autres pages que tu créeras

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> {/* Ta page d'accueil */}
         <Route path="/signup" element={<Signup />} />
         <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        {/* Ajoutez d'autres routes ici */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;