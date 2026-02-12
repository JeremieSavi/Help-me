import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, UserCircle, LogOut, HandHelping, Bell } from 'lucide-react';
import { auth, db } from '../../services/firebase'; // Vérifie bien ton chemin d'import
import { doc, getDoc } from 'firebase/firestore';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // Récupérer le prénom pour l'initiale
  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().prenom);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const activeStyle = "flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200 transition-all";
  const inactiveStyle = "flex items-center gap-3 p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-tighter">
          <HandHelping size={32} /> <span>HelpMe</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-3">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
            <Home size={20} /> <span className="font-medium">Fil d'actualité</span>
          </NavLink>
          
          <NavLink to="/dashboard/neighbors" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
            <Users size={20} /> <span className="font-medium">Mes voisins</span>
          </NavLink>

          <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
            <UserCircle size={20} /> <span className="font-medium">Mon Profil</span>
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="m-6 flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
          <LogOut size={20} /> <span>Déconnexion</span>
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b flex items-center justify-end px-8 shrink-0 gap-6">
          
          {/* Icône Notification */}
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
            <Bell size={22} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Avatar avec Initiale */}
          <NavLink 
            to="/dashboard/profile" 
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-transparent hover:border-blue-700 hover:scale-105 transition-all shadow-sm"
          >
            {userName ? userName.charAt(0).toUpperCase() : "..."}
          </NavLink>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;