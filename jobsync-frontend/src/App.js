import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddApplication from './pages/AddApplication';
import ApplicationDetail from './pages/ApplicationDetail';

function App() {
  return (
    <Router>
      <div className="page-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddApplication />} />
            <Route path="/application/:id" element={<ApplicationDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;