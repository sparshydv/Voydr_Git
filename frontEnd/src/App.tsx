import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { Reports } from './pages/reports';
import { Settings } from './pages/settings';
import { Profile } from './pages/profile';
import { Signup } from './pages/signup';
import LimitSettings from "./pages/LimitSettings";

import Chatbot from "./components/layout/chatbot";   // <-- ADD THIS

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/limits" element={<LimitSettings />} />  {/* FIXED */}
          </Routes>
        </main>

        <Footer />

        {/* Chatbot always visible */}
        <Chatbot />   {/* <-- ADDED */}
      </div>
    </Router>
  );
}

export default App;
