import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddVisitor from './pages/AddVisitor';
import ScanPass from './pages/ScanPass';

function App() {
  const user = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* If user is logged in, show Dashboard, else force them to Login */}
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/add-visitor" element={user ? <AddVisitor /> : <Navigate to="/login" />} />
        <Route path="/scan" element={<ScanPass />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;