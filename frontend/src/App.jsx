import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Documentation from './pages/Documentation';
import UseCases from './pages/UseCases';
import Testing from './pages/Testing';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080D18] text-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/testing" element={<Testing />} />
          {/* Fallback route to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
