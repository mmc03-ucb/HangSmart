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
  useTheme
} from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon, Add as AddIcon, Login as LoginIcon } from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

  const handleCreateGroup = () => {
    console.log("Create group with name:", groupName);
    setGroupName('');
    setCreateGroupOpen(false);
    alert("Group creation functionality will be implemented later");
  };

  const handleJoinGroup = () => {
    console.log("Join group with code:", groupCode);
    setGroupCode('');
    setJoinGroupOpen(false);
    alert("Group joining functionality will be implemented later");
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
                  sx={{ mt: { xs: 1, sm: 2 } }}
                >
                  Create a Group
                </Typography>
                <Typography 
                  variant="body1" 
                  align="center" 
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    px: { xs: 1, sm: 2 } 
                  }}
                >
                  Start a new group and invite your friends to join with a unique code
                </Typography>
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => setCreateGroupOpen(true)}
                  fullWidth
                  sx={{ 
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                    borderRadius: '28px',
                    mt: 'auto'
                  }}
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
                  sx={{ mt: { xs: 1, sm: 2 } }}
                >
                  Join a Group
                </Typography>
                <Typography 
                  variant="body1" 
                  align="center" 
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    px: { xs: 1, sm: 2 } 
                  }}
                >
                  Enter a 6-digit code to join your friends' group
                </Typography>
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  color="secondary"
                  onClick={() => setJoinGroupOpen(true)}
                  fullWidth
                  sx={{ 
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                    borderRadius: '28px',
                    mt: 'auto'
                  }}
                >
                  Join Group
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Create Group Dialog */}
      <Dialog 
        open={createGroupOpen} 
        onClose={() => setCreateGroupOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ pt: { xs: 2, sm: 3 } }}>Create a New Group</DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography gutterBottom sx={{ mb: 2 }}>
            Create a group and invite your friends to join with a unique code.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={() => setCreateGroupOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup} color="primary" disabled={!groupName} variant="contained">
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Group Dialog */}
      <Dialog 
        open={joinGroupOpen} 
        onClose={() => setJoinGroupOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ pt: { xs: 2, sm: 3 } }}>Join a Group</DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography gutterBottom sx={{ mb: 2 }}>
            Enter the 6-digit group code to join an existing group.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Group Code"
            fullWidth
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={() => setJoinGroupOpen(false)}>Cancel</Button>
          <Button onClick={handleJoinGroup} color="secondary" disabled={!groupCode} variant="contained">
            Join Group
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default Landing;