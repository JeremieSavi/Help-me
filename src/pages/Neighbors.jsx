import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { 
  MapPin, 
  Briefcase, 
  MessageCircle, 
  UserPlus, 
  ShieldCheck,
  Search
} from 'lucide-react';

const Neighbors = () => {
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myInfo, setMyInfo] = useState(null);

  useEffect(() => {
    const getNeighborsData = async () => {
      try {
        // 1. Récupérer mon profil pour connaître mon quartier
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const userData = userDoc.data();
        setMyInfo(userData);

        // 2. Requête pour trouver les voisins du même quartier
        const q = query(
          collection(db, "users"), 
          where("quartier", "==", userData.quartier)
        );

        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          // On exclut l'utilisateur actuel de la liste des voisins
          if (doc.id !== auth.currentUser.uid) {
            list.push({ id: doc.id, ...doc.data() });
          }
        });

        setNeighbors(list);
      } catch (error) {
        console.error("Erreur lors de la récupération des voisins:", error);
      } finally {
        setLoading(false);
      }
    };

    getNeighborsData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Mes Voisins
          </h1>
          <div className="flex items-center gap-2 text-blue-600 mt-1 font-medium">
            <MapPin size={18} />
            <span>À {myInfo?.quartier || "chargement..."}</span>
          </div>
        </div>

        {/* BARRE DE RECHERCHE LOCALE (Design) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un voisin..." 
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      {/* GRILLE DES VOISINS */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : neighbors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">Vous êtes le premier habitant de {myInfo?.quartier} inscrit !</p>
          <p className="text-gray-400">Invitez vos voisins à rejoindre la communauté.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighbors.map((neighbor) => (
            <div 
              key={neighbor.id} 
              className="group bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 relative overflow-hidden"
            >
              {/* Badge de confiance (design) */}
              <div className="absolute top-4 right-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <ShieldCheck size={20} />
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img 
                    src={neighbor.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${neighbor.nom}`} 
                    alt="" 
                    className="w-24 h-24 rounded-2xl object-cover bg-blue-50 ring-4 ring-white shadow-sm transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white" title="En ligne"></div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {neighbor.prenom} {neighbor.nom}
                </h3>
                
                <p className="text-blue-600 text-sm font-semibold mb-4 bg-blue-50 px-3 py-1 rounded-full">
                  {neighbor.profession}
                </p>

                <div className="space-y-2 w-full text-left bg-gray-50 p-4 rounded-2xl mb-6">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>Habite à <span className="font-medium">{neighbor.quartier}</span></span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Briefcase size={16} className="mr-2 text-gray-400" />
                    <span>Expertise : {neighbor.profession}</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <MessageCircle size={18} />
                    Message
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-blue-100 hover:text-blue-600 transition-all active:scale-95">
                    <UserPlus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Neighbors;