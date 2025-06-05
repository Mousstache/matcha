// import { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from "react-router-dom";import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { Navigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';


// import { ReactNode } from 'react';

import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Profil from "./pages/Profil";
import ConsultProfil from "./pages/ConsultProfil";
import Explore from "./pages/Explore";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import Chat from "./pages/Chat";
import Notification from "./pages/Notification";
import BlockList  from "./pages/BlockList";
import ForgotPassword  from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   created_at?: string;
// }

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const isAuthenticated = localStorage.getItem('token') !== null;
//   console.log(isAuthenticated);
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
  
//   return children;
// };

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (!payload.emailConfirmed) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return <Navigate to="/login" replace />;
  }
};

const RouteNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* 404 avec coeur */}
        <div className="relative mb-6">
          <h1 className="text-6xl font-bold text-pink-500">404</h1>
          <Heart className="absolute -top-2 -right-2 text-red-400" size={24} />
        </div>
        
        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Cette page a swipé vers la gauche 💔
        </h2>
        <p className="text-gray-600 mb-8">
          Pas de match ici ! Retournons chercher l'amour ailleurs.
        </p>
        
        {/* Boutons */}
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  
  return (
   <Router>
      <Routes>
        {/* Pages SANS Layout (pas de Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
        <Route path="/reset-password" element={ <ResetPassword /> } />
        <Route path="/forgot-password" element={ <ForgotPassword /> } />
        <Route path="*" element={<RouteNotFound />} />

        {/* Pages AVEC Layout */}
        <Route
          path="/"
          element={<Layout> <ProtectedRoute>
                <Home />
              </ProtectedRoute> </Layout>
          }
        />
        <Route
          path="/explore"
          element={<Layout><ProtectedRoute>
                <Explore />
              </ProtectedRoute> </Layout>
          }
        />
        <Route
          path="/profil"
          element={<Layout><ProtectedRoute>
                <Profil />
              </ProtectedRoute> </Layout>
          }
        />
        <Route
          path="/block"
          element={<Layout><ProtectedRoute>
                <BlockList />
              </ProtectedRoute> </Layout>
          }
        />
        <Route
          path="/consult-profil/:username"
          element={<Layout><ProtectedRoute>
                <ConsultProfil />
              </ProtectedRoute> </Layout>
          }
        />
        <Route
          path="/chat"
          element={<Layout><ProtectedRoute>
                <Chat />
              </ProtectedRoute> </Layout>
          }
        />
        <Route
          path="/chat/:match_id"
          element={<Layout><ProtectedRoute>
                <Chat />
              </ProtectedRoute> </Layout>
          }
        />
        <Route
          path="/notification"
          element={<Layout><ProtectedRoute>
                <Notification />
              </ProtectedRoute> </Layout>
          }
        />
      </Routes>
    </Router>
  );
}


export default App