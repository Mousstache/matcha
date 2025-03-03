import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  firstname: string;
  lastname: string;
  setFirstname: React.Dispatch<React.SetStateAction<string>>;
  setLastname: React.Dispatch<React.SetStateAction<string>>;
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

  return <AuthContext.Provider value={{ firstname, lastname, setFirstname, setLastname }}>{children}</AuthContext.Provider>;
};