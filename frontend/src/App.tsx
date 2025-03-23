// import { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from "react-router-dom";import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { Navigate } from 'react-router-dom';


// import { ReactNode } from 'react';

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
<<<<<<< HEAD
import Home from "./components/Home";
import Signup from "./components/Signup";
import Profil from "./components/Profil";
import Explore from "./components/Explore";
import Register from "./components/Register";
import ConfirmEmail from "./components/ConfirmEmail";
import Chat from "./components/Chat";
import Notification from "./components/Notification"; 
=======
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Profil from "./pages/Profil";
import Explore from "./pages/Explore";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import Chat from "./pages/Chat";
import Notification from "./pages/Notification";
>>>>>>> 0620a995d4c26aa45a89c6c862217bee1c2614f2

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   created_at?: string;
// }

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
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
        <title>Matcha</title>
        <Navbar />
        <Routes>
        <Route path="*" element={<RouteNotFound />} />
        {/* <Route path="/404" element={<RouteNotFound />} /> */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/profil/:username" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute ><Chat></Chat></ProtectedRoute>} />
        <Route path="/chat/:match_id" element={<ProtectedRoute ><Chat></Chat></ProtectedRoute>} />
<<<<<<< HEAD
        <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
=======
        <Route path="/notification" element={<ProtectedRoute ><Notification></Notification></ProtectedRoute>} />
>>>>>>> 0620a995d4c26aa45a89c6c862217bee1c2614f2
        </Routes>
        <Footer />
      </Router>
  )
}


export default App