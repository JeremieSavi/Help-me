import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, MapPin, Briefcase, Mail, CheckCircle, Camera } from 'lucide-react';

const Profil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const docRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(docRef, {
        profession: userData.profession,
        quartier: userData.quartier
      });
      alert("Profil mis à jour !");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500 animate-pulse">Chargement de votre profil...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner de décoration */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="px-8 pb-8">
          {/* Avatar Photo */}
          <div className="relative -mt-16 mb-6">
            <img 
              src={userData?.photo} 
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-md bg-white object-cover" 
              alt="Profil" 
            />
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-blue-600 hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 w-full">
              <h1 className="text-3xl font-bold text-gray-900">{userData?.prenom} {userData?.nom}</h1>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <CheckCircle size={16} className="text-green-500" /> Membre vérifié
              </p>

              <form onSubmit={handleUpdate} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                      <Briefcase size={16}/> Profession
                    </label>
                    <input 
                      type="text" 
                      value={userData?.profession}
                      onChange={(e) => setUserData({...userData, profession: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                      <MapPin size={16}/> Mon Quartier
                    </label>
                    <input 
                      type="text" 
                      value={userData?.quartier}
                      onChange={(e) => setUserData({...userData, quartier: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-4 border border-blue-100">
                  <Mail className="text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Email (non modifiable)</p>
                    <p className="text-blue-900 font-medium">{userData?.email}</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={updating}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {updating ? "Mise à jour..." : "Sauvegarder les modifications"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;