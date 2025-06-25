import { useEffect } from 'react';
import { addToast } from '@/utils/toast';

interface SocketEventData {
  type: string;
  message: string;
  userId: number;
  matchId?: number;
  userInfo: {
    id: number;
    firstname: string;
    lastname: string;
    profile_picture: string;
  };
}

interface UseSocketEventsOptions {
  socket: any; // Socket | null
  onDataUpdate?: () => void; // Callback pour rafraîchir les données
  showToasts?: boolean; // Afficher ou non les toasts
}

export const useSocketEvents = ({ 
  socket, 
  onDataUpdate, 
  showToasts = true 
}: UseSocketEventsOptions) => {
  useEffect(() => {
    if (socket) {
      // Écouter les événements de like
      socket.on('like_received', (data: SocketEventData) => {
        if (showToasts) {
          addToast({
            title: "💖 Nouveau like!",
            description: data.message,
            duration: 5000,
          });
        }
        if (onDataUpdate) onDataUpdate();
      });

      socket.on('like_sent', (_data: SocketEventData) => {
        if (onDataUpdate) onDataUpdate();
      });

      // Écouter les événements d'unlike
      socket.on('unlike_received', (data: SocketEventData) => {
        if (showToasts) {
          addToast({
            title: "💔 Like retiré",
            description: data.message,
            duration: 5000,
          });
        }
        if (onDataUpdate) onDataUpdate();
      });

      socket.on('unlike_sent', (_data: SocketEventData) => {
        if (onDataUpdate) onDataUpdate();
      });

      // Écouter les événements de blocage
      socket.on('user_blocked_you', (data: SocketEventData) => {
        if (showToasts) {
          addToast({
            title: "🚫 Utilisateur bloqué",
            description: data.message,
            duration: 5000,
          });
        }
        if (onDataUpdate) onDataUpdate();
      });

      socket.on('user_blocked', (data: SocketEventData) => {
        if (showToasts) {
          addToast({
            title: "🚫 Utilisateur bloqué",
            description: data.message,
            duration: 3000,
          });
        }
        if (onDataUpdate) onDataUpdate();
      });

      // Écouter les événements de déblocage
      socket.on('user_unblocked_you', (data: SocketEventData) => {
        if (showToasts) {
          addToast({
            title: "✅ Utilisateur débloqué",
            description: data.message,
            duration: 5000,
          });
        }
        if (onDataUpdate) onDataUpdate();
      });

      socket.on('user_unblocked', (data: SocketEventData) => {
        if (showToasts) {
          addToast({
            title: "✅ Utilisateur débloqué",
            description: data.message,
            duration: 3000,
          });
        }
        if (onDataUpdate) onDataUpdate();
      });

      // Écouter les événements de match
      socket.on('match', (data: SocketEventData) => {
        if (showToasts) {
          addToast({
            title: "🎉 Nouveau match!",
            description: data.message,
            duration: 5000,
          });
        }
        if (onDataUpdate) onDataUpdate();
      });

      // Nettoyer les écouteurs lors du démontage du composant
      return () => {
        socket.off('like_received');
        socket.off('like_sent');
        socket.off('unlike_received');
        socket.off('unlike_sent');
        socket.off('user_blocked_you');
        socket.off('user_blocked');
        socket.off('user_unblocked_you');
        socket.off('user_unblocked');
        socket.off('match');
      };
    }
  }, [socket, onDataUpdate, showToasts]);
};
