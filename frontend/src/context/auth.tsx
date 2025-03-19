import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  sexualPreference: string;
  latitude: number;
  longitude: number;
  description: string;
  loading: boolean;
  error: string | null;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setFirstname: React.Dispatch<React.SetStateAction<string>>;
  setLastname: React.Dispatch<React.SetStateAction<string>>;
  setAge: React.Dispatch<React.SetStateAction<number>>;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  setSexualPreference: React.Dispatch<React.SetStateAction<string>>;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>('');
  const [sexualPreference, setSexualPreference] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/user", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("mes données de l'authProvider :", data);
        
        // Mise à jour de toutes les données du profil
        setId(data.user.id || '');
        setFirstname(data.user.firstname || '');
        setLastname(data.user.lastname || '');
        setAge(data.user.age || 0);
        setGender(data.user.gender || '');
        setSexualPreference(data.user.preference || '');
        setLatitude(data.user.latitude || 0);
        setLongitude(data.user.longitude || 0);
        setDescription(data.user.description || '');
      } else if (response.status === 401) {
        // Token invalide ou expiré
        localStorage.removeItem('token');
        setError("Session expirée. Veuillez vous reconnecter.");
      } else {
        setError("Erreur lors de la récupération des données utilisateur");
      }
    } catch (error) {
      console.error("Erreur de requête:", error);
      setError("Problème de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider 
      value={{
        id, 
        firstname, 
        lastname, 
        age, 
        latitude, 
        longitude, 
        description, 
        sexualPreference, 
        gender, 
        loading,
        error,
        setFirstname, 
        setLastname, 
        setAge, 
        setGender, 
        setId, 
        setDescription, 
        setLatitude, 
        setLongitude, 
        setSexualPreference,
        refreshUserData: fetchUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};