import React, { useState } from 'react';

import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn, ArrowRight, BatteryFull } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // On demande à Firebase Auth de vérifier les identifiants
      await signInWithEmailAndPassword(auth, email, password);
      
      // Si c'est bon, on va sur le dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Identifiants incorrects ou compte inexistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Bon retour !  </h2>
            <p className="text-slate-500 mt-2">Connectez-vous pour aider vos voisins</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email */}
            <div className="relative">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative mt-1">
               
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <div className="flex justify-between ml-1">
                <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
                <a href="#" className="text-sm text-blue-600 hover:underline">Oublié ?</a>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Bouton Connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-8">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;