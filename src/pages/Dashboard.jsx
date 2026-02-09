import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  PlusCircle, 
  MapPin, 
  User as UserIcon, 
  Bell, 
  Search,
  HandHelping
} from 'lucide-react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Ecouter si un utilisateur est connecté
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // 2. Aller chercher son profil dans Firestore via son UID
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      } else {
        // Pas connecté ? Retour au login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-bounce text-blue-600 font-bold text-xl">Chargement de votre quartier...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col p-6">
        <div className="flex items-center space-x-2 mb-10 text-blue-600">
          <HandHelping className="w-8 h-8" />
          <span className="text-2xl font-bold italic">HelpMe</span>
        </div>

        <nav className="flex-1 space-y-4">
          <button className="flex items-center space-x-3 text-blue-600 font-semibold w-full p-2 bg-blue-50 rounded-lg">
            <Search className="w-5 h-5" /> <span>Explorer</span>
          </button>
          <button className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 w-full p-2">
            <PlusCircle className="w-5 h-5" /> <span>Publier un besoin</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-500 mt-auto p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" /> <span>Déconnexion</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center text-slate-600">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            <span className="font-medium">Quartier : {userData?.quartier}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-slate-400 cursor-pointer" />
            <div className="flex items-center space-x-3 border-l pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{userData?.prenom} {userData?.nom}</p>
                <p className="text-xs text-slate-500">{userData?.profession}</p>
              </div>
              <img 
                src={userData?.photo} 
                alt="Profil" 
                className="w-10 h-10 rounded-full border-2 border-blue-100"
              />
            </div>
          </div>
        </header>

        {/* FEED / ACTUALITÉS */}
        <section className="p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Besoins à {userData?.quartier}</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                <PlusCircle className="w-5 h-5" />
                <span>Nouveau besoin</span>
              </button>
            </div>

            {/* MESSAGE VIDE (Pour l'instant) */}
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-500">Aucune annonce pour le moment à {userData?.quartier}.</p>
              <p className="text-sm text-slate-400 mt-1">Soyez le premier à demander un coup de main !</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;