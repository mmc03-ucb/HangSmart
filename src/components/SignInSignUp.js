import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Divider, Snackbar, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { auth, db, provider } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function SignInSignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/landing';
    } catch (err) {
      setError("Invalid Email or Password. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSnackbarOpen(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        profilePicture: '',
        features: ['basic'],
        preferences: {},
      });

      window.location.href = '/landing';
    } catch (err) {
      setError("Account already exists, please Sign In Instead.");
      setSnackbarOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        createdAt: serverTimestamp(),
        features: ['basic'],
        preferences: {},
      }, { merge: true });

      window.location.href = '/landing';
    } catch (err) {
      setError(err.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#e0f7fa">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, minWidth: 350, maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          {isSignUp ? 'Create Account' : 'Welcome'}
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {isSignUp && (
          <TextField fullWidth margin="normal" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {isSignUp && (
          <TextField fullWidth margin="normal" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        )}
        <Button fullWidth variant="contained" color="primary" onClick={isSignUp ? handleSignUp : handleSignIn} sx={{ marginTop: 2, padding: 1.2 }}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button fullWidth variant="outlined" color="primary" startIcon={<GoogleIcon />} onClick={handleGoogleSignIn} sx={{ marginTop: 2, padding: 1.2 }}>
          Sign In with Google
        </Button>
        <Typography variant="body2" sx={{ marginTop: 2 }} onClick={handleToggle} color="textSecondary" style={{ cursor: 'pointer' }}>
          {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
        </Typography>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignInSignUp;