// import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/auth";
import { Card, CardContent, CardTitle, } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import { addToast } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Ban, UserRound } from "lucide-react";



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
    const { id, socket } = useAuth();

    const fetchBlockedUsers = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch('http://localhost:5001/api/getBlockUser', {
            method: "GET",
            headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          const data = await res.json();
          setBlocks(data.list || []);
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs bloqués:", error);
          addToast({
            title: "Erreur",
            description: "Impossible de récupérer la liste des utilisateurs bloqués",
            duration: 3000,
          });
        }
    };

    useEffect(() => {
      fetchBlockedUsers();
    }, []);

    // Utiliser le hook personnalisé pour les événements socket
    useSocketEvents({ 
      socket, 
      onDataUpdate: fetchBlockedUsers,
      showToasts: true 
    });

    const handleUnBlock = async (block_id: any) => {
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
        
        if (!res.ok) {
          throw new Error('Erreur lors du déblocage');
        }
        
        // TEMPORAIRE: Ajout de fetchBlockedUsers() pour tester
        await fetchBlockedUsers();
        
        addToast({
          title: "Utilisateur débloqué",
          description: "L'utilisateur a été débloqué avec succès",
          duration: 3000,
        });
        
      } catch (error) {
        console.error("Erreur lors du déblocage:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de débloquer cet utilisateur",
          duration: 3000,
        });
      }
    };


    return (
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardTitle className="p-6 border-b">
              <div className="flex items-center gap-2">
                <Ban className="h-6 w-6 text-red-500" />
                <h2 className="text-2xl font-bold">Utilisateurs bloqués</h2>
              </div>
            </CardTitle>

            <CardContent className="p-6">
              {blocks && blocks.length > 0 ? (
                <div className="grid gap-4">
                  {blocks.map((block) => (
                    <div key={block.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <UserRound className="h-10 w-10 text-gray-400 border rounded-full p-2" />
                        <div>
                          <p className="font-semibold text-lg">{block.firstname} {block.lastname}</p>
                          <p className="text-gray-500 text-sm">{block.email}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnBlock(block.id)}
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                      >
                        Débloquer
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Ban className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucun utilisateur bloqué</p>
                  <p className="text-gray-400 text-sm mt-2">Les utilisateurs que vous bloquez apparaîtront ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    );
};

export default BlockList;