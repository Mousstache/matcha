// import { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from "react-router-dom";import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { Navigate } from 'react-router-dom';


// import { ReactNode } from 'react';

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Profil from "./components/Profil";
import Explore from "./components/Explore";
import Register from "./components/Register";
import ConfirmEmail from "./components/ConfirmEmail";
import Chat from "./components/Chat";

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
        </Routes>
        <Footer />
      </Router>
  )
}


export default App