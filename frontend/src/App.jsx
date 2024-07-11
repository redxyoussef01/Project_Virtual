import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home  from './pages/dashboard';
import Produit from './pages/produit';
import Stock from './pages/emplacement';
import Affichge from './pages/3daff';
import Login from './pages/login';
function App() {


  return (
    <>
       <BrowserRouter>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Produits" element={<Produit />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/Affichage" element={<Affichge />} />
        <Route path="/" element={<Login />} />    

      </Routes>
 </BrowserRouter>
    </>
  )
}

export default App;


 
      
      