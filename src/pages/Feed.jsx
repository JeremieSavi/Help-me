import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { 
  collection, query, orderBy, onSnapshot, 
  addDoc, serverTimestamp, doc, getDoc, where 
} from 'firebase/firestore';
import { 
  Send, MessageCircle, Clock, MapPin, 
  Tag, HandHelping, AlertCircle 
} from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState("Général");
  const [targetQuartier, setTargetQuartier] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const categories = ["Général", "Bricolage", "Ménage", "Cours", "Transport", "Santé"];

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile(data);
          setTargetQuartier(data.quartier); // Par défaut, on publie dans son quartier
        }
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    // On récupère les posts où l'auteur N'EST PAS l'utilisateur actuel
    // Pour que l'utilisateur voit les besoins des AUTRES à combler
    const q = query(
      collection(db, "posts"), 
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => post.authorId !== auth.currentUser.uid); // Filtrage côté client
      
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await addDoc(collection(db, "posts"), {
        content: newPost,
        category: category,
        authorId: auth.currentUser.uid,
        authorName: `${userProfile?.prenom} ${userProfile?.nom}`,
        authorPhoto: userProfile?.photo || "",
        publishIn: targetQuartier,
        createdAt: serverTimestamp(),
        status: "ouvert"
      });
      setNewPost("");
      alert("Votre besoin a été publié dans le quartier " + targetQuartier);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* FORMULAIRE DE PUBLICATION AMÉLIORÉ */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="text-blue-600" size={20}/> Exprimer un besoin
        </h2>
        <form onSubmit={handlePublish} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Décrivez votre besoin (ex: Cherche aide pour déplacer un meuble...)"
            className="w-full border-none bg-gray-50 rounded-2xl p-4 focus:ring-2 focus:ring-blue-100 text-gray-700 min-h-[100px]"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-1 flex items-center gap-1">
                <Tag size={12}/> Catégorie
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-1 flex items-center gap-1">
                <MapPin size={12}/> Zone de publication
              </label>
              <select 
                value={targetQuartier}
                onChange={(e) => setTargetQuartier(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100"
              >
                <option value={userProfile?.quartier}>Mon quartier ({userProfile?.quartier})</option>
                <option value="Tout Cotonou">Tout Cotonou</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!newPost.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            <Send size={18} /> Diffuser le besoin
          </button>
        </form>
      </div>

      {/* FIL DES BESOINS DES AUTRES */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-500 text-sm ml-2 uppercase tracking-widest">
          Besoins à combler autour de vous
        </h3>
        {loading ? (
          <div className="animate-pulse space-y-4">
             {[1,2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl"/>)}
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                    {post.authorName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{post.authorName}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
                        {post.category}
                      </span>
                      <span>•</span>
                      <MapPin size={12} /> {post.publishIn}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-gray-300 flex items-center gap-1">
                  <Clock size={10}/> Il y a un instant
                </div>
              </div>

              <p className="text-gray-700 mb-6 bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-500 italic">
                "{post.content}"
              </p>

              <button className="w-full py-3 bg-green-50 text-green-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all group">
                <HandHelping size={20} className="group-hover:animate-bounce" />
                Je peux m'en occuper
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;