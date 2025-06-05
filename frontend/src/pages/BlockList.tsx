// import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/auth";
import { Card, CardContent, CardTitle, } from "@/components/ui/card";
import { useEffect, useState } from "react";



interface Block {
    match_id: number;
    id: number;
    email: string;
    firstname: string;
    lastname: string;
  }

const BlockList = () => {
    // const { notifications, setNotifications } = useNotifications();
    const [blocks , setBlocks] = useState<Block[]>([]);
    const { id } = useAuth();


  useEffect(() => {
      id;
    const blockList = async () => {
        const token = localStorage.getItem("token");
          const res = await fetch('http://localhost:5001/api/getBlockUser', {
            method: "GET",
            headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          const data = await res.json();
          setBlocks(data.user);
          if (!res)
            return ;
            
          if (!data)
            return ;
      };
    blockList();
  }, []);


  const handleUnBlock = async (block_id:any) =>{

    try {
      const token = localStorage.getItem("token");
            const res = await fetch('http://localhost:5001/api/unblockUser', {
              method: "DELETE",
              headers:{
                'Authorization': `Bearer ${token}`,
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


    return (
        <Card>
        <CardTitle>
          <h2>Listes des matchs :</h2>
        </CardTitle>

        <CardContent>
        <p>
            {blocks && blocks.length > 0 ? (
              <ul className="space-y-2">
                {blocks.map((block) => (
                  <li key={block.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
                    <p className="font-semibold">{block.firstname}</p>
                    <p className="text-gray-500">{block.email}</p>

                    <button className="text-white" onClick={ () => handleUnBlock(block.id)}> unblock user </button>

                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun like pour l'instant</p>
            )}
          </p>
        </CardContent>
        </Card>
    );
};

export default BlockList;