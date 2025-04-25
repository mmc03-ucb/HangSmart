import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ThemeProvider,
  createTheme,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon, 
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Interests as InterestsIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

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
});

function Recommendations() {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));

  useEffect(() => {
    const groupRef = doc(db, 'groups', groupId);
    
    const unsubscribe = onSnapshot(groupRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setGroupData(data);
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

  const handleBack = () => {
    navigate('/landing');
  };

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
              Group Members & Preferences
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Here are all the group members and their preferences. We'll use this information to generate personalized recommendations.
            </Typography>

            <List>
              {groupData?.members?.map((member, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: member.uid === auth.currentUser?.uid ? 'primary.main' : 'grey.700' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: member.uid === auth.currentUser?.uid ? 'bold' : 'normal' }}>
                          {member.name}
                          {member.uid === auth.currentUser?.uid && ' (You)'}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          {member.preferences?.interests && (
                            <Box>
                              <Chip
                                icon={<InterestsIcon />}
                                label="Interests"
                                size="small"
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {member.preferences.interests}
                              </Typography>
                            </Box>
                          )}
                          
                          {member.preferences?.location && (
                            <Box>
                              <Chip
                                icon={<LocationIcon />}
                                label="Location"
                                size="small"
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {member.preferences.location}
                              </Typography>
                            </Box>
                          )}
                          
                          {member.preferences?.availability && (
                            <Box>
                              <Chip
                                icon={<CalendarIcon />}
                                label="Availability"
                                size="small"
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {member.preferences.availability}
                              </Typography>
                            </Box>
                          )}
                          
                          {member.preferences?.specialRequests && (
                            <Box>
                              <Chip
                                icon={<InfoIcon />}
                                label="Special Requests"
                                size="small"
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {member.preferences.specialRequests}
                              </Typography>
                            </Box>
                          )}
                          
                          {!member.preferences && (
                            <Typography variant="body2" color="textSecondary">
                              No preferences provided yet
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < (groupData.members.length - 1) && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Recommendations;
