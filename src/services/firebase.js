// Import des fonctions nécessaires depuis les SDK Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        // Pour l'authentification (Login/Signup)
import { getFirestore } from "firebase/firestore"; // Pour la base de données (Profils/Annonces)
  // Pour stocker les images (si besoin plus tard)

// Ta configuration Firebase (déjà remplie avec tes clés)
const firebaseConfig = {
  apiKey: "AIzaSyA3qQJbdczW3DmGA1epI_2ZRkOW8Crh9fo",
  authDomain: "helpme-backend-3d3f3.firebaseapp.com",
  projectId: "helpme-backend-3d3f3",
  storageBucket: "helpme-backend-3d3f3.firebasestorage.app",
  messagingSenderId: "969333527863",
  appId: "1:969333527863:web:f01b113c5e2e08b611b6b2"
};

// 1. Initialiser l'application Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialiser les services et les exporter pour les utiliser partout
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;