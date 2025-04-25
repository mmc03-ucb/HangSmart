/**
 * Main application component that handles routing and navigation
 * Sets up the React Router with all application routes
 */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSignUp from './components/SignInSignUp';
import Landing from './components/Landing';
import Profile from './components/Profile';
import PromptInput from './components/PromptInput';
import Recommendations from './components/Recommendations';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root route - Sign in/Sign up page */}
        <Route path="/" element={<SignInSignUp />} />
        
        {/* Main landing page after authentication */}
        <Route path="/landing" element={<Landing />} />
        
        {/* User profile management */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Group preferences input page */}
        <Route path="/prompt/:groupId" element={<PromptInput />} />
        
        {/* Group recommendations display page */}
        <Route path="/recommendations/:groupId" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}

export default App;