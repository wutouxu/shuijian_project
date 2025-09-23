
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };


  

  return (
    <div>
      {!isLoggedIn ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Dashboard />}
    </div>
  );
}

export default App;
