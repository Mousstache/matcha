import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Send, Ban, Flag, HeartCrack, Heart, User, Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import { useAuth } from "@/context/auth";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  description: string;
  gender: number;
  preference: number;
  birthDate: number;
  fame_rate: number;
  online: boolean;
  lastconnection: string;
  profile_picture: string;
}

interface Match {
  match_id: number;
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  online: boolean;
  profile_picture: string;
}

interface Block {
  match_id: number;
  block_id: number;
  email: string;
  firstname: string;
  lastname: string;
}

const Home = () => {
  const [likes, setLikes] = useState<User[]>([]);
  const [otherLikes, setOtherLikes] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [viewlist, setViewlist] = useState<User[]>([]);
  const { id, blockedUsers, firstname } = useAuth();
  const { socket } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const [likesRes, otherLikesRes, matchesRes, viewlistRes] = await Promise.all([
          fetch('http://localhost:5001/api/getLikes', {
            method: "GET",
            headers: {
              'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5001/api/getOtherLikes', {
            method: "GET",
            headers: {
              'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5001/api/getMatches', {
            method: "GET",
            headers: {
              'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5001/api/getViewlist', {
            method: "GET",
            headers: {
              'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const [likesData, otherLikesData, matchesData, viewlistData] = await Promise.all([
          likesRes.json(),
          otherLikesRes.json(),
          matchesRes.json(),
          viewlistRes.json()
        ]);

        setLikes(likesData.likes);
        setOtherLikes(otherLikesData.Otherlikes);
        setMatches(matchesData.matches);
        setViewlist(viewlistData.viewlist);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  const handleSignal = async (match_id: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch('http://localhost:5001/api/signalUser', {
        method: "POST",
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ match_id, reporter_id: id, reason: "fake account" })
      });
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
    }
  };

  const handleBlock = async (match_id: number) => {
    try {
      const token = localStorage.getItem("token");
      
      await fetch('http://localhost:5001/api/blockUser', {
        method: "POST",
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ match_id, blocker_id: id })
      });
    } catch (error) {
      console.error("Erreur lors du blocage:", error);
    }
  };

  const handleUnlike = async (match_id: number, liked_id: number) => {
    try {
      const token = localStorage.getItem("token");

      await fetch('http://localhost:5001/api/unlikeUser', {
        method: "DELETE",
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ liker_id: id, liked_id, match_id })
      });

      const notif_unlike = { 
        userId: liked_id,
        type: "unlike",
        message: `📩 ${firstname} vous a unliker`
      };
      
      if (socket) {
        socket.emit("SEND_NOTIFICATION", notif_unlike);
      }
    } catch (error) {
      console.error("Erreur lors du unlike:", error);
    }
  };

  const handlelike = async (liked_id: number) => {
    try {
      const token = localStorage.getItem("token");
      
      await fetch('http://localhost:5001/api/likeUser', {
        method: "POST",
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ liker_id: id, liked_id })
      });

      const notif_like = { 
        userId: liked_id,
        type: "like",
        message: `📩 ${firstname} liked back`
      };
      
      if (socket) {
        socket.emit("SEND_NOTIFICATION", notif_like);
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const handleUnBlock = async (block_id: number) => {
    try {
      const token = localStorage.getItem("token");
      
      await fetch('http://localhost:5001/api/unblockUser', {
        method: "DELETE",
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ block_id, id })
      });
    } catch (error) {
      console.error("Erreur lors du déblocage:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-6 sm:py-10 px-2 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-pink-600">Vos connexions</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="flex flex-wrap h-16 w-full justify-around bg-pink-500/90 rounded-none rounded-b-xl p-0">
              <TabsTrigger 
                value="matches" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-200 border-l-4 border-l-white/80 first:border-l-0
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:shadow-lg`}
              >
                <MessageSquare size={24} className="mr-2" />
                <span>Matchs</span>
                {matches && matches.length > 0 && (
                  <span className="bg-white text-pink-500 text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ml-2">
                    {matches.length}
                  </span>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="likes" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-200 border-l-4 border-l-white/80 first:border-l-0
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:shadow-lg`}
              >
                <Heart size={24} className="mr-2" />
                <span>Vos Likes</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="received-likes" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-200 border-l-4 border-l-white/80 first:border-l-0
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:shadow-lg`}
              >
                <ThumbsUp size={24} className="mr-2" />
                <span>Likes reçus</span>
                {otherLikes && otherLikes.length > 0 && (
                  <span className="bg-white text-pink-500 text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ml-2">
                    {otherLikes.length}
                  </span>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="blocked" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-200 border-l-4 border-l-white/80 first:border-l-0
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:shadow-lg`}
              >
                <Ban size={24} className="mr-2" />
                <span>Bloqués</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="views" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-200 border-l-4 border-l-white/80 first:border-l-0
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:shadow-lg`}
              >
                <Eye size={24} className="mr-2" />
                <span>Vues</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenu des onglets */}
            <TabsContent value="matches" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-pink-600">Vos matchs</h2>
              {matches && matches.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4">
                  {matches.map((user) => (
                    <li 
                      key={user.match_id} 
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-200">
                              <User size={24} className="text-pink-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-base sm:text-lg">{user.firstname}</p>
                          <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button 
                          onClick={() => navigate(`/chat/:${user.match_id}`)}
                          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm shadow font-poppins bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-lg transition-all"
                        >
                          <Send size={16} className="mr-1" />
                          <span>Chatter</span>
                        </button>
                        
                        <button 
                          onClick={() => handleUnlike(user.match_id, user.id)}
                          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm shadow font-poppins bg-gray-100 text-pink-600 hover:bg-pink-100 hover:text-pink-700 hover:shadow-lg transition-all"
                        >
                          <HeartCrack size={16} className="mr-1" />
                          <span>Unlike</span>
                        </button>
                        
                        <button 
                          onClick={() => handleBlock(user.match_id)}
                          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm shadow font-poppins bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 hover:shadow-lg transition-all"
                        >
                          <Ban size={16} className="mr-1" />
                          <span>Bloquer</span>
                        </button>
                        
                        <button 
                          onClick={() => handleSignal(user.match_id)}
                          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium text-xs sm:text-sm shadow font-poppins bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700 hover:shadow-lg transition-all"
                        >
                          <Flag size={16} className="mr-1" />
                          <span>Signaler</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-500">
                  <MessageSquare size={48} className="text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">Vous n'avez pas encore de matchs</p>
                  <p className="text-xs sm:text-sm mt-2">Commencez à liker des profils pour trouver des matchs</p>
                </div>
              )}
            </TabsContent>

            {/* Contenu du tab Vos Likes */}
            <TabsContent value="likes" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-pink-600">Profils que vous aimez</h2>
              {likes && likes.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {likes.map((user) => (
                    <li 
                      key={user.id} 
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50"
                    >
                      <div className="flex items-center">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-200">
                              <User size={24} className="text-pink-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base">{user.firstname}</p>
                          <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-500">
                  <Heart size={48} className="text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">Vous n'avez liké aucun profil pour l'instant</p>
                </div>
              )}
            </TabsContent>

            {/* Contenu du tab Likes reçus */}
            <TabsContent value="received-likes" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-pink-600">Ils vous ont liké</h2>
              {otherLikes && otherLikes.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {otherLikes.map((user) => (
                    <li 
                      key={user.id} 
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50 cursor-pointer"
                      onClick={() => navigate(`/profile/:${user.id}`)}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-200">
                              <User size={24} className="text-pink-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base">{user.firstname}</p>
                          <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-xs sm:text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlelike(user.id);
                        }}
                      >
                        <Heart size={16} />
                        <span>Liker en retour</span>
                      </button>
                      
                      <p className="text-xs text-center mt-2 text-gray-500">Cliquez sur le profil pour plus de détails</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-500">
                  <ThumbsUp size={48} className="text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">Personne ne vous a encore liké</p>
                </div>
              )}
            </TabsContent>

            {/* Contenu du tab Bloqués */}
            <TabsContent value="blocked" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-pink-600">Utilisateurs bloqués</h2>
              {blockedUsers && blockedUsers.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4">
                  {blockedUsers.map((user: Block) => (
                    <li 
                      key={user.block_id} 
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm flex items-center justify-between bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                          <div className="flex items-center justify-center h-full">
                            <User size={20} className="text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-gray-700">{user.firstname}</p>
                          <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleUnBlock(user.block_id)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                      >
                        Débloquer
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-500">
                  <Ban size={48} className="text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">Vous n'avez bloqué aucun utilisateur</p>
                </div>
              )}
            </TabsContent>

            {/* Contenu du tab Vues */}
            <TabsContent value="views" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-pink-600">Ils ont visité votre profil</h2>
              {viewlist && viewlist.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {viewlist.map((user) => (
                    <li 
                      key={user.id} 
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gray-200 mb-2 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-100">
                              <User size={32} className="text-pink-500" />
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm sm:text-base">{user.firstname}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">A visité le {new Date().toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-500">
                  <Eye size={48} className="text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">Personne n'a encore consulté votre profil</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Home;