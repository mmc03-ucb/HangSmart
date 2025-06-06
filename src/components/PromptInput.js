/**
 * Component for collecting user preferences for group activities
 * Handles input and submission of user interests, availability, and special requests
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  CircularProgress,
  useMediaQuery,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  Divider,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Person as PersonIcon, 
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Send as SendIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
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
      default: 'linear-gradient(135deg, #2a1a5e 0%, #121212 100%)',
      paper: 'rgba(30, 30, 46, 0.8)',
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(144, 202, 249, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#90caf9',
            },
          },
        },
      },
    },
  },
});

/**
 * PromptInput component for collecting user preferences
 * Manages form state and submission to Firestore
 */
function PromptInput() {
  // Component state management
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interests, setInterests] = useState('');
  const [availability, setAvailability] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [recommendationsReady, setRecommendationsReady] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));

  // Fetch and monitor group data
  useEffect(() => {
    const groupRef = doc(db, 'groups', groupId);
    
    const unsubscribe = onSnapshot(groupRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setGroupData(data);
          
          // Check if this user already has preferences
          if (data.members) {
            const currentMember = data.members.find(member => member.uid === auth.currentUser?.uid);
            if (currentMember?.preferences) {
              setInterests(currentMember.preferences.interests || '');
              setAvailability(currentMember.preferences.availability || '');
              setSpecialRequests(currentMember.preferences.specialRequests || '');
              setLocation(currentMember.preferences.location || '');
            }

            // Check if all users have provided preferences
            const allUsersHavePreferences = data.members.every(member => member.preferences);
            const hasEnoughUsers = data.members.length >= 2;

            setRecommendationsReady(allUsersHavePreferences && hasEnoughUsers);
          }
          
          setLoading(false);
        } else {
          setError('Group not found');
          setLoading(false);
        }
      },
      (err) => {
        setError('Error loading group data');
        setLoading(false);
        console.error("Error loading group:", err.message);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  // Navigation handlers
  const handleBack = () => {
    navigate('/landing');
  };

  // Save user preferences to Firestore
  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);
      
      if (!groupDoc.exists()) {
        throw new Error('Group not found');
      }
      
      const currentData = groupDoc.data();
      const members = currentData.members || [];
      
      // Find and update current user's preferences
      const memberIndex = members.findIndex(member => member.uid === auth.currentUser?.uid);
      
      if (memberIndex !== -1) {
        const updatedMembers = [...members];
        updatedMembers[memberIndex] = {
          ...updatedMembers[memberIndex],
          preferences: {
            interests,
            availability,
            specialRequests,
            location,
            updatedAt: new Date()
          },
          photoURL: auth.currentUser?.photoURL || null
        };
        
        await updateDoc(groupRef, { members: updatedMembers });
        
        setSnackbarMessage('Your preferences have been saved!');
        setSnackbarSeverity('success');
      } else {
        throw new Error('You are not a member of this group');
      }
    } catch (err) {
      console.error('Error saving preferences:', err.message);
      setSnackbarMessage('Failed to save preferences. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };

  // Calendar integration placeholder
  const handleConnectCalendar = () => {
    setSnackbarMessage('Google Calendar integration would happen here!');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // UI handlers
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography color="error">{error}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        flexGrow: 1, 
        minHeight: '100vh', 
        pb: 4,
        background: 'linear-gradient(135deg, #2a1a5e 0%, #121212 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <AppBar position="static" sx={{ background: 'rgba(30, 30, 46, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleBack}
              aria-label="back"
              size={isMobile ? "small" : "medium"}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              component="img"
              src="/images/logo.png"
              alt="HangSmart Logo"
              sx={{ 
                width: 36, 
                height: 36,
                mr: 1,
                display: { xs: 'none', sm: 'block' }
              }}
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                ml: 1
              }}
            >
              {groupData?.name || 'Group'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                mr: 2
              }}
            >
              Group Code: <span style={{ fontWeight: 'bold' }}>{groupId}</span>
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 3,
              borderRadius: 2,
              border: '1px solid rgba(144, 202, 249, 0.2)',
              background: 'linear-gradient(145deg, #2d1d63 0%, #1e1e2e 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Tell us about yourself
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Share your interests and availability to help us suggest the perfect activities for your group.
            </Typography>

            <Stack spacing={3} sx={{ mt: 3 }}>
              {/* Interests Input */}
              <TextField
                label="What are your interests?"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="I love Italian food, hiking, and indie movies..."
                helperText="Tell us what you enjoy doing in your free time"
              />

              {/* Availability Input */}
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1 }} color="primary" />
                  When are you available?
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="I'm free on weekday evenings after 6pm and all day on weekends..."
                  />
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<EventAvailableIcon />}
                    onClick={handleConnectCalendar}
                    sx={{ 
                      whiteSpace: 'nowrap',
                      minWidth: { xs: '100%', sm: 'auto' },
                      alignSelf: { xs: 'stretch', sm: 'flex-start' }
                    }}
                  >
                    Connect Calendar
                  </Button>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  Optionally, connect your Google Calendar to automatically check your availability
                </Typography>
              </Box>

              {/* Special Requests */}
              <TextField
                label="Any special requests?"
                multiline
                rows={2}
                fullWidth
                variant="outlined"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="I prefer outdoor activities, need wheelchair access..."
                helperText="Tell us about any preferences or requirements for your activities"
              />

              {/* Location Input */}
              <TextField
                label="Where are you located?"
                fullWidth
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your city or neighborhood..."
                helperText="This helps us find activities near you"
              />

              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<SendIcon />}
                onClick={handleSavePreferences}
                disabled={saving}
                sx={{ 
                  mt: 2,
                  alignSelf: 'flex-end',
                  borderRadius: '28px',
                  px: 3
                }}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>

              {recommendationsReady && (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  onClick={() => navigate(`/recommendations/${groupId}`)}
                  sx={{ 
                    mt: 2,
                    alignSelf: 'flex-end',
                    borderRadius: '28px',
                    px: 3,
                    background: 'linear-gradient(45deg, #f48fb1 30%, #f06292 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #f06292 30%, #ec407a 90%)',
                    }
                  }}
                >
                  View Recommendations
                </Button>
              )}
            </Stack>
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              border: '1px solid rgba(144, 202, 249, 0.2)',
              background: 'linear-gradient(145deg, #2d1d63 0%, #1e1e2e 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Group Members
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {groupData?.members?.map((member, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar 
                      src={member.photoURL} 
                      sx={{ 
                        bgcolor: member.uid === auth.currentUser?.uid ? 'primary.main' : 'grey.700',
                        width: 40,
                        height: 40
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: member.uid === auth.currentUser?.uid ? 'bold' : 'normal' }}>
                        {member.name.split(' ')[0]}
                        {member.uid === auth.currentUser?.uid && ' (You)'}
                      </Typography>
                    }
                    secondary={
                      member.preferences?.updatedAt ? 
                      "Preferences updated" : 
                      "No preferences yet"
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Container>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default PromptInput;
