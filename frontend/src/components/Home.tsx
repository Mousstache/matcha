import { Card, CardContent, CardTitle, } from "@/components/ui/card";
import { useEffect } from "react";
import { useState } from "react";

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

const Home = () => {
  const [likes, setLikes] = useState<User[]>([]);
  const [otherLikes, setOtherLikes] = useState<User[]>([]);

  useEffect(() => {
    const likelist = async () => {

        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5000/api/getLikes', {
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
        const res = await fetch('http://localhost:5000/api/getOtherLikes', {
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

    likelist();
    likeOtherList();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-3xl font-bold">
      <Card>
        <CardTitle>
          <h1>Listes des matchs :</h1>
        </CardTitle>

        <CardContent>
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
          <h1>Listes des gens qui likent :</h1>
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