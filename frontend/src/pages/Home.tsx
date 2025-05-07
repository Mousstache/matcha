// import { Card, CardContent, CardTitle, } from "@/components/ui/card";
// import { match } from "assert";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Send, Ban, Flag, HeartCrack, Heart, User, Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import { useAuth } from "@/context/auth";
import UserProfilModal from "@/components/UserProfilModal";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
// import { Link } from "react-router-dom";


interface User{
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

const Home = () => {
  const [likes, setLikes] = useState<User[]>([]);
  const [otherLikes, setOtherLikes] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [viewlist, setViewlist] = useState<User[]>([]);
  const { id, blockedUsers, firstname } = useAuth();
  const { socket } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const likelist = async () => {

        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5001/api/getLikes', {
          method: "GET",
          headers:{
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        const data = await res.json();
        setLikes(data.likes);

        if (!res)
          return ;
           
        if (!data)
          return ;
      };
    
    const likeOtherList = async () => {

      const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5001/api/getOtherLikes', {
          method: "GET",
          headers:{
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        const data = await res.json();
        setOtherLikes(data.Otherlikes);
        if (!otherLikes)
          console.log("ya r");

        if (!res)
          return ;
           
        if (!data)
          return ;
    };

    const matchList = async () => {
        const token = localStorage.getItem("token");
          const res = await fetch('http://localhost:5001/api/getMatches', {
            method: "GET",
            headers:{
              'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          const data = await res.json();
          setMatches(data.matches);
          if (!otherLikes)
            console.log("ya r");

          if (!res)
            return ;
            
          if (!data)
            return ;
      };

    const viewList = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch('http://localhost:5001/api/getViewlist', {
        method: "GET",
        headers:{
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await res.json();
      setViewlist(data.viewlist);
      // if (!)
      //   console.log("ya r");

      if (!res)
        return ;
        
      if (!data)
        return ;
  };

    likelist();
    likeOtherList();
    matchList();
    viewList();
  }, []);


  const handleSignal = async (match_id:any) =>{

    try {
      console.log("match_id = ", match_id);
      const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5001/api/signalUser', {
          method: "POST",
          headers:{
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({match_id: match_id , reporter_id: id, reason: "fake account"})
        })
        
        const data = await res.json();
        if (!res)
          return ;
          
        if (!data)
          return ;
    }catch (error){
      console.log(error);
    }
  };


  const handleBlock = async (match_id:any) =>{

    try {
      console.log("match_id = ", match_id);
      const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5001/api/blockUser', {
          method: "POST",
          headers:{
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({match_id: match_id , blocker_id: id})
        })
        
        const data = await res.json();
        if (!res)
          return ;
          
        if (!data)
          return ;
    }catch (error){
      console.log(error);
    }
  };


  const handleUnlike = async (match_id:any, liked_id:any) =>{
    try {
      const token = localStorage.getItem("token");
      console.log("match_id = ", match_id);
      console.log("liked_id = ", liked_id);
            const res = await fetch('http://localhost:5001/api/unlikeUser', {
              method: "DELETE",
              headers:{
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({liker_id: id, liked_id, match_id})
            })
            
            const data = await res.json();
  
            if (!res)
              return ;
              
            if (!data)
              return ;

            const notif_unlike = { 
              userId: liked_id,
              type: "unlike",
              message: `📩 ${firstname} vous a unliker`
          };
            if (socket){
                socket.emit("SEND_NOTIFICATION",  notif_unlike);
            }
    }catch (error){
      console.log(error);
    }
  };


  const handlelike = async ( liked_id:any) =>{
    try {
      const token = localStorage.getItem("token");
            const res = await fetch('http://localhost:5001/api/likeUser', {
              method: "POST",
              headers:{
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({liker_id: id, liked_id})
            })
            
            const data = await res.json();
  
            if (!res)
              return ;
              
            if (!data)
              return ;

            const notif_like = { 
              userId: liked_id,
              type: "like",
              message: `📩 ${firstname} liked back`
          };
            if (socket){
                socket.emit("SEND_NOTIFICATION",  notif_like);
            }
    }catch (error){
      console.log(error);
    }
  };

  const handleUnBlock = async (block_id:any) =>{
    console.log("block_id = ", block_id);
    try {
      const token = localStorage.getItem("token");
            const res = await fetch('http://localhost:5001/api/unblockUser', {
              method: "DELETE",
              headers:{
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({block_id , id})
            })
            
            const data = await res.json();
  
            if (!res)
              return ;
              
            if (!data)
              return ;
    }catch (error){
      console.log(error);
    }
  };


  const handleUserClick = (user:any) => {
    console.log("User clicked:", user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  
//   return (
//     <div className="flex items-center justify-center min-h-screen text-3xl font-bold">
//       <Card>
//         <CardTitle>
//           <h2>Listes des matchs :</h2>
//         </CardTitle>

//         <CardContent>
//         <div>
//             {matches && matches.length > 0 ? (
//               <ul className="space-y-2">
//                 {matches.map((user) => (
//                   <li key={user.match_id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
//                     <p className="font-semibold">{user.firstname}</p>
//                     <p className="text-gray-500">{user.email}</p>
//                     {/* <Link to="/chat/:${match.match_id}" className="flex items-center space-x-1">
//                       <Send/> <span>chatter</span>
//                     </Link> */}

//                     <button className="text-white" onClick={ () => handleBlock(user.match_id)}>block user <Ban></Ban> </button>

//                     <button className="text-white" onClick={ () => handleSignal(user.match_id)}>signal user <Flag></Flag> </button>

//                     <button className="text-white" onClick={ () => handleUnlike(user.match_id, user.id)}>unlike user <HeartCrack></HeartCrack> </button>

//                     <button className="text-white" onClick={ () => navigate(`/chat/:${user.match_id}`)}>commencer le chat <Send></Send> </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Aucun match</p>
//             )}
//           </div>
//         </CardContent>

//         <CardTitle>
//           <h2>Listes des Like :</h2>
//         </CardTitle>

//         <CardContent>
//           <div>
//             {likes && likes.length > 0 ? (
//               <ul className="space-y-2">
//                 {likes.map((user) => (
//                   <li key={user.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
//                     <p className="font-semibold">{user.firstname}</p>
//                     <p className="text-gray-500">{user.email}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Aucun like pour l'instant</p>
//             )}
//           </div>
//         </CardContent>

//         <CardTitle>
//           <h2>Listes des gens qui likent :</h2>
//         </CardTitle>

//         <CardContent>
//         <div>
//             {otherLikes && otherLikes.length > 0 ? (
//               <ul className="space-y-2">
//                 {otherLikes.map((user) => (
//                   <li key={user.id} className="p-2 border border-gray-300 rounded-lg shadow-sm" onClick={() => handleUserClick(user)} >
//                     <p className="font-semibold">{user.firstname}</p>
//                     <p className="text-gray-500">{user.email}</p>
//                     <p className="text-sm text-gray-600">Clique pour voir le profil</p>
//                     <button className="text-white" onClick={ () => handlelike(user.id)}>like  back user <Heart></Heart> </button>
//                     {/* <button className="text-white" onClick={ () => navigate(`consult-profil/:${user.id}`)}>consult profil <Search></Search> </button> */}
//                       <UserProfilModal
//                       isOpen={isModalOpen}
//                       onClose={() => setIsModalOpen(false)}
//                       user={selectedUser}
//                     />
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Aucun like pour l'instant</p>
//             )}
//           </div>
//         </CardContent>


//         <CardTitle>
//           <h2>Listes des Blocks :</h2>
//         </CardTitle>

//         <CardContent>
//         <div>
//             {blockedUsers && blockedUsers.length > 0 ? (
//               <ul className="space-y-2">
//                 {blockedUsers.map((user) => (
//                   <li key={user.block_id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
//                     <p className="font-semibold">{user.firstname}</p>
//                     <p className="text-gray-500">{user.email}</p>
//                     <button className="text-white" onClick={ () => handleUnBlock(user.block_id)}> unblock user </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Aucun block</p>
//             )}
//           </div>
//         </CardContent>


//         <CardTitle>
//           <h2>Listes des Views :</h2>
//         </CardTitle>

//         <CardContent>
//         <div>
//             {viewlist && viewlist.length > 0 ? (
//               <ul className="space-y-2">
//                 {viewlist.map((user) => (
//                   <li key={user.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
//                     <p className="font-semibold">{user.firstname}</p>
//                     <p className="text-gray-500">{user.email}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Aucune vue</p>
//             )}
//           </div>
//         </CardContent>

//       </Card>
//     </div>
//   );
// };


// return (
//   <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-10 px-4">
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">Vos connexions</h1>
      
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <Tabs className="w-full">
//           <TabsList className="flex bg-gray-100 border-b">
//             <Tab className="px-6 py-3 text-center flex-1 cursor-pointer font-medium outline-none hover:bg-pink-50">
//               <div className="flex items-center justify-center gap-2">
//                 <MessageSquare size={18} className="text-pink-600" />
//                 <span>Matchs</span>
//                 {matches && matches.length > 0 && (
//                   <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
//                     {matches.length}
//                   </span>
//                 )}
//               </div>
//             </Tab>
//             <Tab className="px-6 py-3 text-center flex-1 cursor-pointer font-medium outline-none hover:bg-pink-50">
//               <div className="flex items-center justify-center gap-2">
//                 <Heart size={18} className="text-pink-600" />
//                 <span>Vos Likes</span>
//               </div>
//             </Tab>
//             <Tab className="px-6 py-3 text-center flex-1 cursor-pointer font-medium outline-none hover:bg-pink-50">
//               <div className="flex items-center justify-center gap-2">
//                 <ThumbsUp size={18} className="text-pink-600" />
//                 <span>Likes reçus</span>
//                 {otherLikes && otherLikes.length > 0 && (
//                   <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
//                     {otherLikes.length}
//                   </span>
//                 )}
//               </div>
//             </Tab>
//             <Tab className="px-6 py-3 text-center flex-1 cursor-pointer font-medium outline-none hover:bg-pink-50">
//               <div className="flex items-center justify-center gap-2">
//                 <Ban size={18} className="text-pink-600" />
//                 <span>Bloqués</span>
//               </div>
//             </Tab>
//             <Tab className="px-6 py-3 text-center flex-1 cursor-pointer font-medium outline-none hover:bg-pink-50">
//               <div className="flex items-center justify-center gap-2">
//                 <Eye size={18} className="text-pink-600" />
//                 <span>Vues</span>
//               </div>
//             </Tab>
//           </TabsList>

//           {/* Panel des matchs */}
//           <TabPanel className="p-4">
//             <h2 className="text-xl font-semibold mb-4 text-pink-600">Vos matchs</h2>
//             {matches && matches.length > 0 ? (
//               <ul className="space-y-4">
//                 {matches.map((user) => (
//                   <li 
//                     key={user.match_id} 
//                     className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50"
//                   >
//                     <div className="flex items-center mb-3">
//                       <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
//                         {user.profile_picture ? (
//                           <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="flex items-center justify-center h-full bg-pink-200">
//                             <User size={24} className="text-pink-600" />
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-lg">{user.firstname}</p>
//                         <p className="text-gray-500 text-sm">{user.email}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       <button 
//                         onClick={() => navigate(`/chat/:${user.match_id}`)}
//                         className="flex items-center gap-1 px-3 py-1.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
//                       >
//                         <Send size={16} />
//                         <span>Chatter</span>
//                       </button>
                      
//                       <button 
//                         onClick={() => handleUnlike(user.match_id, user.id)}
//                         className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//                       >
//                         <HeartCrack size={16} />
//                         <span>Unlike</span>
//                       </button>
                      
//                       <button 
//                         onClick={() => handleBlock(user.match_id)}
//                         className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                       >
//                         <Ban size={16} />
//                         <span>Bloquer</span>
//                       </button>
                      
//                       <button 
//                         onClick={() => handleSignal(user.match_id)}
//                         className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
//                       >
//                         <Flag size={16} />
//                         <span>Signaler</span>
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//                 <MessageSquare size={48} className="text-gray-300 mb-4" />
//                 <p>Vous n'avez pas encore de matchs</p>
//                 <p className="text-sm mt-2">Commencez à liker des profils pour trouver des matchs</p>
//               </div>
//             )}
//           </TabPanel>

//           {/* Panel des likes envoyés */}
//           <TabPanel className="p-4">
//             <h2 className="text-xl font-semibold mb-4 text-pink-600">Profils que vous aimez</h2>
//             {likes && likes.length > 0 ? (
//               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {likes.map((user) => (
//                   <li 
//                     key={user.id} 
//                     className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50"
//                   >
//                     <div className="flex items-center">
//                       <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
//                         {user.profile_picture ? (
//                           <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="flex items-center justify-center h-full bg-pink-200">
//                             <User size={24} className="text-pink-600" />
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-semibold">{user.firstname}</p>
//                         <p className="text-gray-500 text-sm">{user.email}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//                 <Heart size={48} className="text-gray-300 mb-4" />
//                 <p>Vous n'avez liké aucun profil pour l'instant</p>
//               </div>
//             )}
//           </TabPanel>

//           {/* Panel des likes reçus */}
//           <TabPanel className="p-4">
//             <h2 className="text-xl font-semibold mb-4 text-pink-600">Ils vous ont liké</h2>
//             {otherLikes && otherLikes.length > 0 ? (
//               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {otherLikes.map((user) => (
//                   <li 
//                     key={user.id} 
//                     className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50 cursor-pointer"
//                     onClick={() => handleUserClick(user)}
//                   >
//                     <div className="flex items-center mb-3">
//                       <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
//                         {user.profile_picture ? (
//                           <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="flex items-center justify-center h-full bg-pink-200">
//                             <User size={24} className="text-pink-600" />
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-semibold">{user.firstname}</p>
//                         <p className="text-gray-500 text-sm">{user.email}</p>
//                       </div>
//                     </div>
                    
//                     <button 
//                       className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handlelike(user.id);
//                       }}
//                     >
//                       <Heart size={16} />
//                       <span>Liker en retour</span>
//                     </button>
                    
//                     <p className="text-xs text-center mt-2 text-gray-500">Cliquez sur le profil pour plus de détails</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//                 <ThumbsUp size={48} className="text-gray-300 mb-4" />
//                 <p>Personne ne vous a encore liké</p>
//               </div>
//             )}
            
//             {/* Modal de profil utilisateur */}
//             {isModalOpen && selectedUser && (
//               <UserProfilModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 user={selectedUser}
//               />
//             )}
//           </TabPanel>

//           {/* Panel des utilisateurs bloqués */}
//           <TabPanel className="p-4">
//             <h2 className="text-xl font-semibold mb-4 text-pink-600">Utilisateurs bloqués</h2>
//             {blockedUsers && blockedUsers.length > 0 ? (
//               <ul className="space-y-4">
//                 {blockedUsers.map((user) => (
//                   <li 
//                     key={user.block_id} 
//                     className="p-4 border border-gray-200 rounded-lg shadow-sm flex items-center justify-between bg-gray-50"
//                   >
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
//                         {user.profile_picture ? (
//                           <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="flex items-center justify-center h-full">
//                             <User size={20} className="text-gray-500" />
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-700">{user.firstname}</p>
//                         <p className="text-gray-500 text-sm">{user.email}</p>
//                       </div>
//                     </div>
                    
//                     <button 
//                       onClick={() => handleUnBlock(user.block_id)}
//                       className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
//                     >
//                       Débloquer
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//                 <Ban size={48} className="text-gray-300 mb-4" />
//                 <p>Vous n'avez bloqué aucun utilisateur</p>
//               </div>
//             )}
//           </TabPanel>

//           {/* Panel des vues */}
//           <TabPanel className="p-4">
//             <h2 className="text-xl font-semibold mb-4 text-pink-600">Ils ont visité votre profil</h2>
//             {viewlist && viewlist.length > 0 ? (
//               <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {viewlist.map((user) => (
//                   <li 
//                     key={user.id} 
//                     className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
//                   >
//                     <div className="flex flex-col items-center text-center">
//                       <div className="w-16 h-16 rounded-full bg-gray-200 mb-2 overflow-hidden">
//                         {user.profile_picture ? (
//                           <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="flex items-center justify-center h-full bg-pink-100">
//                             <User size={32} className="text-pink-500" />
//                           </div>
//                         )}
//                       </div>
//                       <p className="font-semibold">{user.firstname}</p>
//                       <p className="text-gray-500 text-sm">{user.email}</p>
//                       <p className="text-xs text-gray-400 mt-1">A visité le {new Date().toLocaleDateString()}</p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//                 <Eye size={48} className="text-gray-300 mb-4" />
//                 <p>Personne n'a encore consulté votre profil</p>
//               </div>
//             )}
//           </TabPanel>
//         </Tabs>
//       </div>
//     </div>
//   </div>
// );
// };

return (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-10 px-4">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">Vos connexions</h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="flex h-auto w-full bg-gray-100 p-0 rounded-none border-b">
            <TabsTrigger 
              value="matches" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none py-3 px-6"
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare size={18} className="text-pink-600" />
                <span>Matchs</span>
                {matches && matches.length > 0 && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {matches.length}
                  </span>
                )}
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="likes" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none py-3 px-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Heart size={18} className="text-pink-600" />
                <span>Vos Likes</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="received-likes" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none py-3 px-6"
            >
              <div className="flex items-center justify-center gap-2">
                <ThumbsUp size={18} className="text-pink-600" />
                <span>Likes reçus</span>
                {otherLikes && otherLikes.length > 0 && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {otherLikes.length}
                  </span>
                )}
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="blocked" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none py-3 px-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Ban size={18} className="text-pink-600" />
                <span>Bloqués</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="views" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none py-3 px-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Eye size={18} className="text-pink-600" />
                <span>Vues</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Contenu du tab Matchs */}
          <TabsContent value="matches" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">Vos matchs</h2>
            {matches && matches.length > 0 ? (
              <ul className="space-y-4">
                {matches.map((user) => (
                  <li 
                    key={user.match_id} 
                    className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-pink-200">
                            <User size={24} className="text-pink-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{user.firstname}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button 
                        onClick={() => navigate(`/chat/:${user.match_id}`)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <Send size={16} />
                        <span>Chatter</span>
                      </button>
                      
                      <button 
                        onClick={() => handleUnlike(user.match_id, user.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <HeartCrack size={16} />
                        <span>Unlike</span>
                      </button>
                      
                      <button 
                        onClick={() => handleBlock(user.match_id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Ban size={16} />
                        <span>Bloquer</span>
                      </button>
                      
                      <button 
                        onClick={() => handleSignal(user.match_id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        <Flag size={16} />
                        <span>Signaler</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <MessageSquare size={48} className="text-gray-300 mb-4" />
                <p>Vous n'avez pas encore de matchs</p>
                <p className="text-sm mt-2">Commencez à liker des profils pour trouver des matchs</p>
              </div>
            )}
          </TabsContent>

          {/* Contenu du tab Vos Likes */}
          <TabsContent value="likes" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">Profils que vous aimez</h2>
            {likes && likes.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likes.map((user) => (
                  <li 
                    key={user.id} 
                    className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-pink-200">
                            <User size={24} className="text-pink-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{user.firstname}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Heart size={48} className="text-gray-300 mb-4" />
                <p>Vous n'avez liké aucun profil pour l'instant</p>
              </div>
            )}
          </TabsContent>

          {/* Contenu du tab Likes reçus */}
          <TabsContent value="received-likes" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">Ils vous ont liké</h2>
            {otherLikes && otherLikes.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherLikes.map((user) => (
                  <li 
                    key={user.id} 
                    className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-pink-50 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-pink-200">
                            <User size={24} className="text-pink-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{user.firstname}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
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
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <ThumbsUp size={48} className="text-gray-300 mb-4" />
                <p>Personne ne vous a encore liké</p>
              </div>
            )}
            
            {/* Modal de profil utilisateur - à implémenter avec les composants shadcn/ui */}
            {isModalOpen && selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4">Profil de {selectedUser.firstname}</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    Fermer
                  </button>
                  {/* Contenu du modal */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                      {selectedUser.profile_picture ? (
                        <img src={selectedUser.profile_picture} alt={selectedUser.firstname} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-pink-200">
                          <User size={36} className="text-pink-600" />
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-lg">{selectedUser.firstname}</p>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Contenu du tab Bloqués */}
          <TabsContent value="blocked" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">Utilisateurs bloqués</h2>
            {blockedUsers && blockedUsers.length > 0 ? (
              <ul className="space-y-4">
                {blockedUsers.map((user) => (
                  <li 
                    key={user.block_id} 
                    className="p-4 border border-gray-200 rounded-lg shadow-sm flex items-center justify-between bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <User size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">{user.firstname}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleUnBlock(user.block_id)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Débloquer
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Ban size={48} className="text-gray-300 mb-4" />
                <p>Vous n'avez bloqué aucun utilisateur</p>
              </div>
            )}
          </TabsContent>

          {/* Contenu du tab Vues */}
          <TabsContent value="views" className="p-4 focus-visible:outline-none focus-visible:ring-0">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">Ils ont visité votre profil</h2>
            {viewlist && viewlist.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {viewlist.map((user) => (
                  <li 
                    key={user.id} 
                    className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-200 mb-2 overflow-hidden">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.firstname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-pink-100">
                            <User size={32} className="text-pink-500" />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold">{user.firstname}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">A visité le {new Date().toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Eye size={48} className="text-gray-300 mb-4" />
                <p>Personne n'a encore consulté votre profil</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
);
}


export default Home;