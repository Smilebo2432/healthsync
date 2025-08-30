import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import { useAuth } from '../../contexts/AuthContext';

const AuthWrapper = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();

  const handleLoginSuccess = (user) => {
    onAuthSuccess(user);
  };

  const handleSignupSuccess = (user) => {
    onAuthSuccess(user);
  };

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div>
      {isLogin ? (
        <Login
          onSwitchToSignup={handleSwitchToSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Signup
          onSwitchToLogin={handleSwitchToLogin}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
};

export default AuthWrapper;
