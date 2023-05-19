import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Menu from "./pages/Menu/Index";
import Blog from "./pages/Blog/Blog";
import Home from "./pages/Home/Index";
import Login from "./pages/Login/index"
import Transaksi from "./pages/Transaksi";

export default function App() {
  const location = useLocation();
  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/transaksi" element={<Transaksi/>}/>
      </Routes>

    </div>



  )
}