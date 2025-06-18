import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Send, Ban, Flag, HeartCrack, Heart, UserRound, Eye, MessageSquare, ThumbsUp, History } from 'lucide-react';
import { useAuth } from "@/context/auth";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import UserProfilModal from "@/components/UserProfilModal";
import { Button } from '@/components/ui/button';


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
  const [history, setHistory] = useState<User[]>([]);
  const { id, blockedUsers, firstname } = useAuth();
  const { socket } = useAuth();

  // const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedUser, setSelectedUser] = useState(null);



  const navigate = useNavigate();

  // useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const [likesRes, otherLikesRes, matchesRes, viewlistRes, historyRes] = await Promise.all([
          fetch('http://localhost:5001/api/getLikes', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5001/api/getOtherLikes', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5001/api/getMatches', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5001/api/getViewlist', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5001/api/getHistory', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const [likesData, otherLikesData, matchesData, viewlistData, historyData] = await Promise.all([
          likesRes.json(),
          otherLikesRes.json(),
          matchesRes.json(),
          viewlistRes.json(),
          historyRes.json()
        ]);

        setLikes(likesData.likes);
        setOtherLikes(otherLikesData.Otherlikes);
        setMatches(matchesData.matches);
        setViewlist(viewlistData.viewlist);
        setHistory(historyData.consulted);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    // fetchData();
  // }, []);

  useEffect(() => {
  fetchData();
}, []);
  
  const handleSignal = async (match_id: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch('http://localhost:5001/api/signalUser', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ match_id, reporter_id: id, reason: "fake account" })
      });
      await fetchData();
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ match_id, blocker_id: id })
      });
      await fetchData();
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ liker_id: id, liked_id, match_id })
      });

      await fetchData();

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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ liker_id: id, liked_id })
      });
      
      await fetchData();
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ block_id, id })
      });
      await fetchData();
    } catch (error) {
      console.error("Erreur lors du déblocage:", error);
    }
  };

  const handleUserClick = (user:any) => {
    console.log("User clicked:", user);
    setSelectedUser(user);
    setIsModalOpen(true);
    handleConsult(user.id);
  };

  const handleConsult = async (viewed_id:string) => {
    try{
      const viewedId = viewed_id;
      const viewerId = id;
      console.log("l'id du mec que je regarde", viewedId);
      const res = await fetch('http://localhost:5001/api/ConsultProfile',{
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({viewedId, viewerId}),
      });

      await fetchData();


      const notif_seen = { 
        userId: viewed_id,
        type: "like",
        message: `📩 ${firstname} a consulter votre profil`
    };
      if (socket){
          socket.emit("SEND_NOTIFICATION",  notif_seen);
      }
      if (!res)
        return ;
    }catch (error){
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-100 py-6 sm:py-10 px-2 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-left mb-4 sm:mb-6">
          <span className="text-[#ec4899]">
            Vos connexions
          </span>
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="flex flex-wrap h-16 w-full justify-around bg-pink-500/90 rounded-none rounded-b-xl p-0">
              <TabsTrigger 
                value="matches" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] font-poppins transition-all duration-100
                  data-[state=active]:bg-pink-900 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] data-[state=active]:ring-2 data-[state=active]:ring-white data-[state=active]:ring-offset-2 data-[state=active]:ring-offset-pink-900
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-pink-100 hover:text-pink-600 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] active:bg-pink-300 active:scale-90 active:translate-y-0.5`}
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
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-100
                  data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-pink-100 hover:text-pink-600 hover:shadow-md active:bg-pink-300 active:scale-90 active:translate-y-0.5`}
              >
                <Heart size={24} className="mr-2" />
                <span>Vos Likes</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="received-likes" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-100
                  data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-pink-100 hover:text-pink-600 hover:shadow-md active:bg-pink-300 active:scale-90 active:translate-y-0.5`}
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
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-100
                  data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-pink-100 hover:text-pink-600 hover:shadow-md active:bg-pink-300 active:scale-90 active:translate-y-0.5`}
              >
                <Ban size={24} className="mr-2" />
                <span>Bloqués</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="views" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-100
                  data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-pink-100 hover:text-pink-600 hover:shadow-md active:bg-pink-300 active:scale-90 active:translate-y-0.5`}
              >
                <Eye size={24} className="mr-2" />
                <span>Vues</span>
              </TabsTrigger>

              <TabsTrigger 
                value="history" 
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 rounded-md font-medium text-base sm:text-lg shadow font-poppins transition-all duration-100
                  data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:bg-pink-400/80 data-[state=inactive]:text-white hover:bg-pink-100 hover:text-pink-600 hover:shadow-md active:bg-pink-300 active:scale-90 active:translate-y-0.5`}
              >
                <History size={24} className="mr-2" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenu des onglets */}
            <TabsContent value="matches" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
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
                              <UserRound size={24} className="text-pink-600" />
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
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-gray-500">
                  <MessageSquare size={56} className="mb-3 sm:mb-4 text-pink-200" />
                  <p className="text-sm sm:text-base">Vous n'avez pas encore de matchs</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Commencez à liker des profils pour trouver des matchs
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Contenu du tab Vos Likes */}
            <TabsContent value="likes" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              {likes && likes.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {likes.map((user) => (
                    <li 
                      key={user.id} 
                      onClick={() => handleUserClick(user)}
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50"
                    >
                      <div className="flex items-center">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-200">
                              <UserRound size={24} className="text-pink-600" />
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
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-gray-500">
                  <Heart size={56} className="mb-3 sm:mb-4 text-pink-200" />
                  <p className="text-sm sm:text-base">Vous n'avez liké aucun profil pour l'instant</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Likez des profils pour les retrouver ici
                  </p>
                </div>
              )}
              <UserProfilModal
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               user={selectedUser}
             />
            </TabsContent>

            {/* Contenu du tab Likes reçus */}
            <TabsContent value="received-likes" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              {otherLikes && otherLikes.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {otherLikes.map((user) => (
                    <li 
                      key={user.id} 
                      onClick={() => handleUserClick(user)}
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50 cursor-pointer"
                      >
                      <div className="flex items-center mb-3">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-200">
                              <UserRound size={24} className="text-pink-600" />
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
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-gray-500">
                  <ThumbsUp size={56} className="mb-3 sm:mb-4 text-pink-200" />
                  <p className="text-sm sm:text-base">Personne ne vous a encore liké</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Quand quelqu'un vous like, vous le verrez ici
                  </p>
                </div>
              )}
              <UserProfilModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
              />
            </TabsContent>

            {/* Contenu du tab Bloqués */}
            <TabsContent value="blocked" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
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
                            <UserRound size={20} className="text-gray-500" />
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
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-gray-500">
                  <Ban size={56} className="mb-3 sm:mb-4 text-pink-200" />
                  <p className="text-sm sm:text-base">Vous n'avez bloqué aucun utilisateur</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Les utilisateurs que vous bloquez apparaîtront ici
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Contenu du tab vues */}
            <TabsContent value="views" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              {viewlist && viewlist.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {viewlist.map((user) => (
                    <li 
                      key={user.id} 
                      onClick={() => handleUserClick(user)}
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gray-200 mb-2 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-100">
                              <UserRound size={32} className="text-pink-500" />
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
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-gray-500">
                  <Eye size={56} className="mb-3 sm:mb-4 text-pink-200" />
                  <p className="text-sm sm:text-base">Personne n'a encore consulté votre profil</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Les personnes qui consultent votre profil seront listées ici
                  </p>
                </div>
              )}
              <UserProfilModal
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               user={selectedUser}
             />
            </TabsContent>
            {/* PAS DE LIGNE VIDE ICI */}
            <TabsContent value="history" className="p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-0">
              {history && history.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {history.map((user) => (
                    <li 
                      key={user.id} 
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gray-200 mb-2 overflow-hidden">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-pink-100">
                              <UserRound size={32} className="text-pink-500" />
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
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-gray-500">
                  <History size={56} className="mb-3 sm:mb-4 text-pink-200" />
                  <p className="text-sm sm:text-base">Vous n'avez encore consulté aucun profil</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Les personnes que vous consulterez seront listées ici
                  </p>
                </div>
              )}
              <UserProfilModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Home;