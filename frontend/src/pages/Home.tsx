import { Card, CardContent, CardTitle, } from "@/components/ui/card";
// import { match } from "assert";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Send, Ban, Flag } from 'lucide-react';
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

  // const handleUnlike = async () =>{

  //   try {
  //     const token = localStorage.getItem("token");
  //           const res = await fetch('http://localhost:5001/api/unlikeUser', {
  //             method: "DELETE",
  //             headers:{
  //               'Authorization': `bearer ${token}`,
  //               'Content-Type': 'application/json'
  //             },
  //             body: JSON.stringify({liker_id, liked_id, match_id})
  //           })
            
  //           const data = await res.json();
  
  //           if (!res)
  //             return ;
              
  //           if (!data)
  //             return ;
  //   }catch (error){
  //     console.log(error);
  //   }
  // };

  
  return (
    <div className="flex items-center justify-center min-h-screen text-3xl font-bold">
      <Card>
        <CardTitle>
          <h2>Listes des matchs :</h2>
        </CardTitle>

        <CardContent>
        <p>
            {matches && matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((match) => (
                  <li key={match.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
                    <p className="font-semibold">{match.firstname}</p>
                    <p className="text-gray-500">{match.email}</p>
                    {/* <Link to="/chat/:${match.match_id}" className="flex items-center space-x-1">
                      <Send/> <span>chatter</span>
                    </Link> */}

                    <button className="text-white" onClick={ () => navigate(`/chat/:${match.match_id}`)}>block user <Ban></Ban> </button>

                    <button className="text-white" onClick={ () => navigate(`/chat/:${match.match_id}`)}>signal user <Flag></Flag> </button>

                    {/* <button className="text-white" onClick={ () => handleUnlike}>unlike user <HeartCrack></HeartCrack> </button> */}

                    <button className="text-white" onClick={ () => navigate(`/chat/:${match.match_id}`)}>commencer le chat <Send></Send> </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun like pour l'instant</p>
            )}
          </p>
        </CardContent>

        <CardTitle>
          <h2>Listes des Like :</h2>
        </CardTitle>

        <CardContent>
          <p>
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
          </p>
        </CardContent>

        <CardTitle>
          <h2>Listes des gens qui likent :</h2>
        </CardTitle>

        <CardContent>
        <p>
            {otherLikes && otherLikes.length > 0 ? (
              <ul className="space-y-2">
                {otherLikes.map((user) => (
                  <li key={user.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
                    <p className="font-semibold">{user.firstname}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun like pour l'instant</p>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;