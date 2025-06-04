// import { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from "react-router-dom";import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { Navigate } from 'react-router-dom';


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
    // Décodage du token
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
    <div>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}

function App() {
  
  return (
   <Router>
      <Routes>
        {/* Pages SANS Layout (pas de Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<ProtectedRoute><Signup /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
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
          path="/chat/:match_id"
          element={<Layout><ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute> </Layout>
          }
        />
         <Route
          path="/chat/:match_id"
          element={<Layout><ProtectedRoute>
                <ForgotPassword />
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