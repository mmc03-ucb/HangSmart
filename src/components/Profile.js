import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert } from '@mui/material';
import { auth, db } from '../firebase/config';
import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name);
          setEmail(data.email);
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setSnackbarMessage("Failed to load profile data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        window.location.href = '/';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!name || !email) {
      setSnackbarMessage("Name and email cannot be empty.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), { name, email });
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setSnackbarMessage("Error updating profile.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      const user = auth.currentUser;
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteDoc(doc(db, 'user_data', user.uid));
      await deleteUser(user);
      window.location.href = '/';
    } catch (err) {
      console.error("Error deleting profile:", err.message);
      setSnackbarMessage("Error deleting profile.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error("Error during logout:", err.message);
      setSnackbarMessage("Error during logout.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleConfirmDelete = async () => { await handleDelete(); handleCloseDialog(); };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h6" marginLeft={2}>Loading Profile...</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f0f2f5">
      <Paper elevation={6} sx={{ padding: 4, width: 400, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h4" color="primary" gutterBottom>Profile</Typography>
        <TextField fullWidth margin="normal" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button fullWidth variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: 2, padding: 1 }}>Save Changes</Button>
        <Button fullWidth variant="contained" color="secondary" onClick={handleLogout} sx={{ marginTop: 2, padding: 1 }}>Logout</Button>
        <Button fullWidth variant="contained" color="error" onClick={handleOpenDialog} sx={{ marginTop: 2, padding: 1 }}>Delete Profile</Button>
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Profile Deletion</DialogTitle>
          <DialogContent><Typography color="error">Are you sure you want to delete your profile? This action cannot be undone.</Typography></DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default Profile;