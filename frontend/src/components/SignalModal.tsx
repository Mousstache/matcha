import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  matchId: number; // C'est en réalité l'ID de l'utilisateur signalé (reported_id)
}

const SignalModal: React.FC<SignalModalProps> = ({
  isOpen,
  onClose,
  userName,
  matchId: reportedId // Renommé en interne pour plus de clarté
}) => {
  const reason = "fake_account";
  const [details, setDetails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const reporterId = localStorage.getItem("user_id");

      const response = await fetch("http://localhost:5001/api/signalUser", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reporter_id: reporterId,
          reported_id: reportedId, // Maintenant on peut passer directement l'ID de l'utilisateur signalé
          reason: `${reason}${details ? ': ' + details : ''}`
        })
      });

      if (response.ok) {
        window.__toastAddFunction && window.__toastAddFunction({
          title: "Signalement envoyé",
          description: "Merci pour votre signalement. Notre équipe va l'examiner.",
          color: "success"
        });
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi du signalement");
      }
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
      window.__toastAddFunction && window.__toastAddFunction({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du signalement.",
        color: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-0 overflow-hidden shadow-xl border border-pink-200">
        <DialogHeader className="bg-gradient-to-r from-pink-500 to-purple-500 p-5 text-white">
          <DialogTitle className="text-xl font-bold flex items-center">
            Signaler un compte suspect
          </DialogTitle>
          <DialogDescription className="text-pink-100">
            Signalez {userName} si vous pensez que ce profil enfreint les règles de Matcha
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Pour quelle raison signalez-vous ce profil ?</h3>
            
            <div className="space-y-3">
              <div 
                className="flex items-center space-x-2 rounded-lg border border-pink-500 bg-pink-50 p-3 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full border border-pink-500 bg-pink-500"></div>
                <div className="cursor-pointer w-full">
                  <span className="font-medium">Faux profil</span>
                  <p className="text-sm text-gray-500">Photos volées ou informations visiblement fausses</p>
                </div>
              </div>
            </div>

            <Textarea 
              placeholder="Détails supplémentaires (optionnel)" 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              className="min-h-[100px] border border-pink-100 focus-visible:ring-pink-500"
            />
          </div>
        </div>

        <DialogFooter className="p-4 bg-gray-50 border-t border-pink-100 flex space-x-3">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignalModal;