import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { auth, db } from '../firebase/config';
import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

function Landing() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
      } finally {
        setLoading(false); // Set loading to false whether success or error
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user);
      } else {
        // If the user is not authenticated, redirect to the sign-in page
        window.location.href = '/';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const user = auth.currentUser;

      // Delete user profile from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteDoc(doc(db, 'user_data', user.uid));

      // Delete user from Firebase Auth
      await deleteUser(user);

      window.location.href = '/';
    } catch (err) {
      console.error("Error during profile deletion:", err.message);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteUser();
    handleCloseDialog();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h6" marginLeft={2}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
      <Typography variant="h4" gutterBottom>
        Welcome, {userName ? userName : "User"}!
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => window.location.href = '/profile'}
        sx={{ marginTop: 2 }}
      >
        Go to Profile
      </Button>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleLogout}
        sx={{ marginTop: 2 }}
      >
        Logout
      </Button>

      <Button 
        variant="contained" 
        color="error" 
        onClick={handleOpenDialog}
        sx={{ marginTop: 2 }}
      >
        Delete Profile
      </Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Are you sure you want to delete your profile and all associated data? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Landing;