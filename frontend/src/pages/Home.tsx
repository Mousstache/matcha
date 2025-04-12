import { Card, CardContent, CardTitle, } from "@/components/ui/card";
// import { match } from "assert";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Send, Ban, Flag, HeartCrack, Heart} from 'lucide-react';
import { useAuth } from "@/context/auth";
import UserProfilModal from "@/components/UserProfilModal";
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
}

interface Match {
  match_id: number;
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

const Home = () => {
  const [likes, setLikes] = useState<User[]>([]);
  const [otherLikes, setOtherLikes] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
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

    likelist();
    likeOtherList();
    matchList();
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

            const notif_like = { 
              userId: liked_id,
              type: "like",
              message: `📩 ${firstname} vous a unliker`
          };
            if (socket){
                socket.emit("SEND_NOTIFICATION",  notif_like);
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
              message: `📩 Nouveau like de ${firstname}`
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

  
  return (
    <div className="flex items-center justify-center min-h-screen text-3xl font-bold">
      <Card>
        <CardTitle>
          <h2>Listes des matchs :</h2>
        </CardTitle>

        <CardContent>
        <div>
            {matches && matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((match) => (
                  <li key={match.match_id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
                    <p className="font-semibold">{match.firstname}</p>
                    <p className="text-gray-500">{match.email}</p>
                    {/* <Link to="/chat/:${match.match_id}" className="flex items-center space-x-1">
                      <Send/> <span>chatter</span>
                    </Link> */}

                    <button className="text-white" onClick={ () => handleBlock(match.match_id)}>block user <Ban></Ban> </button>

                    <button className="text-white" onClick={ () => handleSignal(match.match_id)}>signal user <Flag></Flag> </button>

                    <button className="text-white" onClick={ () => handleUnlike(match.match_id, match.id)}>unlike user <HeartCrack></HeartCrack> </button>

                    <button className="text-white" onClick={ () => navigate(`/chat/:${match.match_id}`)}>commencer le chat <Send></Send> </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun match</p>
            )}
          </div>
        </CardContent>

        <CardTitle>
          <h2>Listes des Like :</h2>
        </CardTitle>

        <CardContent>
          <div>
            {likes && likes.length > 0 ? (
              <ul className="space-y-2">
                {likes.map((user) => (
                  <li key={user.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
                    <p className="font-semibold">{user.firstname}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun like pour l'instant</p>
            )}
          </div>
        </CardContent>

        <CardTitle>
          <h2>Listes des gens qui likent :</h2>
        </CardTitle>

        <CardContent>
        <div>
            {otherLikes && otherLikes.length > 0 ? (
              <ul className="space-y-2">
                {otherLikes.map((user) => (
                  <li key={user.id} className="p-2 border border-gray-300 rounded-lg shadow-sm" onClick={() => handleUserClick(user)} >
                    <p className="font-semibold">{user.firstname}</p>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-600">Clique pour voir le profil</p>
                    <button className="text-white" onClick={ () => handlelike(user.id)}>like  back user <Heart></Heart> </button>
                    {/* <button className="text-white" onClick={ () => navigate(`consult-profil/:${user.id}`)}>consult profil <Search></Search> </button> */}
                      <UserProfilModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      user={selectedUser}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun like pour l'instant</p>
            )}
          </div>
        </CardContent>


        <CardTitle>
          <h2>Listes des Blocks :</h2>
        </CardTitle>

        <CardContent>
        <div>
            {blockedUsers && blockedUsers.length > 0 ? (
              <ul className="space-y-2">
                {blockedUsers.map((user) => (
                  <li key={user.block_id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
                    <p className="font-semibold">{user.firstname}</p>
                    <p className="text-gray-500">{user.email}</p>
                    <button className="text-white" onClick={ () => handleUnBlock(user.block_id)}> unblock user </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun block</p>
            )}
          </div>
        </CardContent>

      </Card>
    </div>
  );
};

export default Home;