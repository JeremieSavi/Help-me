// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, MapPin, Users, ArrowRight } from 'lucide-react'; // Importe les icônes nécessaires

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Logo ou Titre de l'application */}
      <div className="mb-8 text-center">
        <Handshake className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          HelpMe <span className="text-blue-600">Local</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">L'entraide simplifiée, au coin de votre rue.</p>
      </div>

      {/* Section Avantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto my-12">
        <FeatureCard 
          icon={<MapPin className="w-8 h-8 text-blue-500" />}
          title="Ultra-Local"
          description="Trouvez de l'aide ou aidez vos voisins, uniquement dans votre quartier."
        />
        <FeatureCard 
          icon={<Users className="w-8 h-8 text-blue-500" />}
          title="Communauté Forte"
          description="Renforcez les liens et tissez de nouvelles relations avec votre voisinage."
        />
        <FeatureCard 
          icon={<Handshake className="w-8 h-8 text-blue-500" />}
          title="Aide Rapide"
          description="Obtenez des coups de main urgents ou offrez vos services en quelques minutes."
        />
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <button 
          onClick={() => navigate('/signup')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>Rejoindre la communauté</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="mt-4 text-gray-600">Déjà membre ? <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-semibold">Connectez-vous ici</button></p>
      </div>

    </div>
  );
};

// Composant pour les cartes d'avantages
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center border border-gray-200">
    <div className="mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Landing;