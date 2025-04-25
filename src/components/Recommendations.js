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
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Link
} from '@mui/material';
import { 
  Person as PersonIcon, 
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Interests as InterestsIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import mockRecommendationData from '../mockbackend';
import PlaceDetails from './PlaceDetails';

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

        <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3
          }}>
            {/* Main Content - Recommendations */}
            <Box sx={{ 
              flex: { xs: '1 1 auto', lg: '2 1 0%' },
              minWidth: 0 // Prevents flex item from overflowing
            }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h4" sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}>
                    Top Recommendations
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <CalendarIcon fontSize="small" />
                    {mockRecommendationData.date}
                  </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 3 }}>
                  {mockRecommendationData.message}
                </Typography>

                <Stack spacing={3}>
                  {mockRecommendationData.activities.slice(0, 2).map((activity, index) => (
                    <Card 
                      key={index}
                      sx={{ 
                        background: 'rgba(30, 30, 46, 0.5)',
                        border: '1px solid rgba(144, 202, 249, 0.2)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <StarIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                            {activity.title}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary" paragraph>
                          {activity.content}
                        </Typography>
                        {activity.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {activity.location}
                            </Typography>
                          </Box>
                        )}
                        {activity.requests && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {activity.requests}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                      {activity.url && (
                        <CardActions>
                          <Button 
                            size="small" 
                            component={Link} 
                            href={activity.url} 
                            target="_blank"
                            endIcon={<OpenInNewIcon />}
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'rgba(144, 202, 249, 0.1)'
                              }
                            }}
                          >
                            Learn More
                          </Button>
                        </CardActions>
                      )}
                      {activity.title.includes("Star Wars") && (
                        <Box sx={{ p: 2 }}>
                          <PlaceDetails placeId="ChIJcawkWTyuEmsRHdzQ6c68aMw" />
                        </Box>
                      )}
                      {activity.title.includes("Fat Thaigar") && (
                        <Box sx={{ p: 2 }}>
                          <PlaceDetails placeId="ChIJiUWOn5yvEmsRGTtwVQxloTk" />
                        </Box>
                      )}
                    </Card>
                  ))}
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
                <Typography variant="h4" gutterBottom sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  mb: 2
                }}>
                  Other Recommendations
                </Typography>

                <Stack spacing={2}>
                  {mockRecommendationData.activities.slice(2).map((activity, index) => (
                    <Card 
                      key={index}
                      sx={{ 
                        background: 'rgba(30, 30, 46, 0.5)',
                        border: '1px solid rgba(144, 202, 249, 0.2)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          {activity.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {activity.content}
                        </Typography>
                      </CardContent>
                      {activity.url && (
                        <CardActions>
                          <Button 
                            size="small" 
                            component={Link} 
                            href={activity.url} 
                            target="_blank"
                            endIcon={<OpenInNewIcon />}
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'rgba(144, 202, 249, 0.1)'
                              }
                            }}
                          >
                            Learn More
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Box>

            {/* Sidebar - Group Members */}
            <Box sx={{ 
              flex: { xs: '1 1 auto', lg: '1 1 0%' },
              minWidth: 0 // Prevents flex item from overflowing
            }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  position: { lg: 'sticky' },
                  top: { lg: 20 },
                  borderRadius: 2,
                  border: '1px solid rgba(144, 202, 249, 0.2)',
                  background: 'linear-gradient(145deg, #2d1d63 0%, #1e1e2e 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Group Members
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Here are all the group members and their preferences.
                </Typography>

                <List>
                  {groupData?.members?.map((member, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
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
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Recommendations;
