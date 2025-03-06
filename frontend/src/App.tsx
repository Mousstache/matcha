// import { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from "react-router-dom";import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Profil from "./components/Profil";
import Explore from "./components/Explore";

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   created_at?: string;
// }


function App() {

  return (
    <Router>
      <title>Matcha</title>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/profil/:username" element={<Profil />} />
      </Routes>
      <Footer />
    </Router>
  )
}


export default App