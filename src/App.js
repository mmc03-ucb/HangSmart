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
        <Route path="/" element={<SignInSignUp />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/prompt/:groupId" element={<PromptInput />} />
        <Route path="/recommendations/:groupId" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}

export default App;