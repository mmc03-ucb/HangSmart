import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress, 
  TextField,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Avatar,
  Grid,
  IconButton,
  CssBaseline,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon, Add as AddIcon, Login as LoginIcon } from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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

function Landing() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [joinGroupOpen, setJoinGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user);
      } else {
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

  const generateGroupId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      setSnackbarOpen(true);
      return;
    }

    try {
      const groupId = generateGroupId();
      const groupRef = doc(db, 'groups', groupId);
      
      // Create the group document
      await setDoc(groupRef, {
        name: groupName.trim(),
        createdAt: new Date(),
        members: [{
          uid: auth.currentUser.uid,
          name: userName
        }]
      });

      setGroupName('');
      setCreateGroupOpen(false);
      navigate(`/prompt/${groupId}`);
    } catch (err) {
      setError('Failed to create group. Please try again.');
      setSnackbarOpen(true);
      console.error("Error creating group:", err.message);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      setError('Please enter a group code');
      setSnackbarOpen(true);
      return;
    }

    try {
      const groupRef = doc(db, 'groups', groupCode.trim().toUpperCase());
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        setError('Group not found. Please check the code and try again.');
        setSnackbarOpen(true);
        return;
      }

      const groupData = groupDoc.data();
      const members = groupData.members || [];
      
      // Check if user is already a member
      if (members.some(member => member.uid === auth.currentUser.uid)) {
        navigate(`/prompt/${groupCode.trim().toUpperCase()}`);
        return;
      }

      // Add user to the group
      await setDoc(groupRef, {
        ...groupData,
        members: [...members, {
          uid: auth.currentUser.uid,
          name: userName
        }]
      }, { merge: true });

      setGroupCode('');
      setJoinGroupOpen(false);
      navigate(`/prompt/${groupCode.trim().toUpperCase()}`);
    } catch (err) {
      setError('Failed to join group. Please try again.');
      setSnackbarOpen(true);
      console.error("Error joining group:", err.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError('');
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
          <Typography variant="h6" marginLeft={2}>Loading...</Typography>
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
            <Box
              component="img"
              src="/images/logo.svg"
              alt="HangSmart Logo"
              sx={{ 
                width: 40, 
                height: 40,
                mr: 1,
                display: { xs: 'none', sm: 'block' }
              }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              HangSmart
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={() => window.location.href = '/profile'}
              size={isMobile ? "medium" : "large"}
              sx={{ mr: 1 }}
              aria-label="Go to profile"
            >
              <PersonIcon />
            </IconButton>
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

        <Container maxWidth="md" sx={{ mt: { xs: 4, sm: 6, md: 8 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/images/logo.svg"
              alt="HangSmart Logo"
              sx={{ 
                width: { xs: 120, sm: 150, md: 180 }, 
                height: { xs: 120, sm: 150, md: 180 },
                mb: 2
              }}
            />
          </Box>
        
          <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
            Welcome, {userName ? userName : "User"}!
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            paragraph
            sx={{ px: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 3 } }}
          >
            Create a group or join one to start planning activities with friends
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center" sx={{ mt: { xs: 1, sm: 2, md: 4 } }}>
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  border: '1px solid rgba(144, 202, 249, 0.5)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: {
                      xs: 'translateY(-3px)',
                      sm: 'translateY(-5px)'
                    },
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <Avatar sx={{ 
                  m: { xs: 0.5, sm: 1 }, 
                  bgcolor: 'primary.main', 
                  width: { xs: 40, sm: 56 }, 
                  height: { xs: 40, sm: 56 } 
                }}>
                  <AddIcon fontSize={isMobile ? "medium" : "large"} />
                </Avatar>
                <Typography 
                  component="h2" 
                  variant="h5" 
                  align="center" 
                  gutterBottom
                  sx={{ mt: 1 }}
                >
                  Create Group
                </Typography>
                <Typography 
                  variant="body1" 
                  align="center" 
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Start a new group and invite friends to join
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setCreateGroupOpen(true)}
                  sx={{ mt: 'auto' }}
                >
                  Create Group
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  border: '1px solid rgba(244, 143, 177, 0.5)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: {
                      xs: 'translateY(-3px)',
                      sm: 'translateY(-5px)'
                    },
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <Avatar sx={{ 
                  m: { xs: 0.5, sm: 1 }, 
                  bgcolor: 'secondary.main', 
                  width: { xs: 40, sm: 56 }, 
                  height: { xs: 40, sm: 56 } 
                }}>
                  <LoginIcon fontSize={isMobile ? "medium" : "large"} />
                </Avatar>
                <Typography 
                  component="h2" 
                  variant="h5" 
                  align="center" 
                  gutterBottom
                  sx={{ mt: 1 }}
                >
                  Join Group
                </Typography>
                <Typography 
                  variant="body1" 
                  align="center" 
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Join an existing group with a group code
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => setJoinGroupOpen(true)}
                  sx={{ mt: 'auto' }}
                >
                  Join Group
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Dialog open={createGroupOpen} onClose={() => setCreateGroupOpen(false)}>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              type="text"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              error={!!error && !groupName.trim()}
              helperText={error && !groupName.trim() ? error : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateGroupOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup} color="primary">Create</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={joinGroupOpen} onClose={() => setJoinGroupOpen(false)}>
          <DialogTitle>Join Group</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Group Code"
              type="text"
              fullWidth
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              error={!!error && !groupCode.trim()}
              helperText={error && !groupCode.trim() ? error : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJoinGroupOpen(false)}>Cancel</Button>
            <Button onClick={handleJoinGroup} color="primary">Join</Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default Landing;