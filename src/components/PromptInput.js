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
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Person as PersonIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function PromptInput() {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const groupRef = doc(db, 'groups', groupId);
    
    const unsubscribe = onSnapshot(groupRef, 
      (doc) => {
        if (doc.exists()) {
          setGroupData(doc.data());
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {groupData?.name || 'Group'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Group Members
          </Typography>
          <List>
            {groupData?.members?.map((member, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={member.uid === auth.currentUser?.uid ? 'You' : ''}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Group Code
          </Typography>
          <Typography variant="h4" color="primary" align="center">
            {groupId}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            Share this code with friends to join the group
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default PromptInput;
