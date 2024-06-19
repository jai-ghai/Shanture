import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PersonalDetail from "./components/PersonalDetail";
import Navigation from "./components/Navbar";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<PersonalDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
