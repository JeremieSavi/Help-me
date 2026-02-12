import React, { useState } from 'react';
import { auth, db } from '../../services/firebase'; // Vérifie ton chemin d'import
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Briefcase, Loader2, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    quartier: '',
    profession: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Création du compte dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
     
      const user = userCredential.user;

      // 2. Enregistrement des infos complémentaires dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        quartier: formData.quartier,
        profession: formData.profession,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.nom}`, // Avatar auto
        createdAt: new Date().toISOString()
      });

     navigate('/dashboard'); // Redirection vers le tableau de bord
    } catch (error) {
      alert("Erreur lors de l'inscription : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Créer un compte</h2>
            <p className="text-slate-500 mt-2">Rejoignez l'entraide de votre quartier</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  name="nom"
                  placeholder="Nom"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <input
                  name="prenom"
                  placeholder="Prénom"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Quartier */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                name="quartier"
                placeholder="Votre quartier (ex: Plateau, Cocody...)"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Profession */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                name="profession"
                placeholder="Votre profession"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Bouton Inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>S'inscrire gratuitement</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;