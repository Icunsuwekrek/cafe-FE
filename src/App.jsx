import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Menu from "./pages/Menu/Index";
import Blog from "./pages/Blog/Blog";
import Home from "./pages/Home/Index";
import Login from "./pages/Login/index"
import Transaksi from "./pages/Transaksi";
import Middleware from "./pages/middleware";
import User from "./pages/User";
import Meja from "./pages/Meja";

export default function App() {
  const location = useLocation();
  return (
    <div className="App">
      
      <Routes>
        <Route path="/"element={ <Middleware> <Home /> </Middleware>} />
        <Route path="/menu" element={ <Middleware><Menu /></Middleware> } />
        <Route path="/login" element={<Login/>} />
        <Route path="/blog" element={ <Middleware><Blog/></Middleware> }/>
        <Route path="/transaksi" element={ <Middleware><Transaksi/></Middleware> }/>
        <Route path="/user" element={<Middleware><User/></Middleware>}/>
        <Route path="/meja" element={<Middleware><Meja/></Middleware>}/>
      </Routes>

    </div>



  )
}
