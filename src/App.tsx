
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';

function App() {

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
