import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress, 
  Snackbar, 
  Alert,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Avatar,
  CssBaseline,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Logout as LogoutIcon, 
  Delete as DeleteIcon, 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Create a responsive dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '0 16px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width:600px)': {
            margin: '16px',
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
          },
        },
      },
    },
  },
});

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
          <Typography variant="h6" marginLeft={2}>Loading Profile...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 4 }}>
        <AppBar position="static">
          <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => window.location.href = '/landing'}
              sx={{ mr: 2 }}
              aria-label="Back to landing"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              component="img"
              src="/images/logo.svg"
              alt="HangSmart Logo"
              sx={{ 
                width: 36, 
                height: 36,
                mr: 1,
                display: { xs: 'none', sm: 'block' }
              }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Profile
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              size={isMobile ? "medium" : "large"}
              edge="end"
              aria-label="Logout"
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 6, md: 8 }, mb: { xs: 2, sm: 3, md: 4 } }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid rgba(144, 202, 249, 0.2)'
            }}
          >
            <Avatar 
              sx={{ 
                width: { xs: 60, sm: 80 }, 
                height: { xs: 60, sm: 80 }, 
                bgcolor: 'primary.main',
                mb: 2 
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            
            <Typography 
              variant="h4" 
              align="center" 
              color="primary" 
              gutterBottom
              sx={{ mb: { xs: 2, sm: 3 } }}
            >
              Your Profile
            </Typography>

            <TextField 
              fullWidth 
              margin="normal" 
              label="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField 
              fullWidth 
              margin="normal" 
              label="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              onClick={handleSave} 
              startIcon={<SaveIcon />}
              sx={{ 
                mt: 1, 
                py: { xs: 1, sm: 1.2 },
                borderRadius: '28px',
                fontSize: { xs: '0.9rem', sm: '1rem' } 
              }}
            >
              Save Changes
            </Button>
            
            <Button 
              fullWidth 
              variant="outlined" 
              color="error" 
              onClick={handleOpenDialog} 
              startIcon={<DeleteIcon />}
              sx={{ 
                mt: 2, 
                py: { xs: 1, sm: 1.2 },
                borderRadius: '28px',
                fontSize: { xs: '0.9rem', sm: '1rem' } 
              }}
            >
              Delete Profile
            </Button>
          </Paper>
        </Container>
        
        <Dialog 
          open={open} 
          onClose={handleCloseDialog}
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ pt: { xs: 2, sm: 3 } }}>Confirm Profile Deletion</DialogTitle>
          <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography color="error">
              Are you sure you want to delete your profile? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={3000} 
          onClose={handleSnackbarClose} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default Profile;