/**
 * App Component
 * Main application component
 */


import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LoginSignup from './components/LoginSignup';
import './index.css';


function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
  };

  return (
    <>
      <Dashboard
        user={user ? { ...user, onLogout: handleLogout } : null}
        onLoginClick={() => setShowLogin(true)}
      />
      {showLogin && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <LoginSignup onLogin={(u) => { setUser(u); setShowLogin(false); }} onBack={() => setShowLogin(false)} />
        </div>
      )}
    </>
  );
}

export default App;

