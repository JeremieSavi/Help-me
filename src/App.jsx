// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/common/Landing'; // Importe la Landing Page
import Signup from './pages/common/Signup';
import Login from './pages/common/Login';

import Feed from './pages/Feed';
import DashboardLayout from './components/layouts/DashboardLayout';
import Neighbors from './pages/Neighbors';
import Profil from './pages/Profil';

// Importe les autres pages que tu créeras

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> {/* Ta page d'accueil */}
         <Route path="/signup" element={<Signup />} />
         <Route path="/login" element={<Login />} />
      

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Feed />} /> {/* path: /dashboard */}
          <Route path="neighbors" element={<Neighbors />} /> {/* path: /dashboard/neighbors */}
          <Route path="profile" element={<Profil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;