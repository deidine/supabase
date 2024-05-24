import React, { useEffect, useState } from "react";
import "./App.css";
 
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Table from "./comanents/Tables";
import Login from "./Login";
import Signup from "./Signup";
 

function App() {
   
  return (
   <Router>
   <Routes>
    <Route path="/" element={<Table/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    </Routes>
    </Router>
  );
}

export default App;
