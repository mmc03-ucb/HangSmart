import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Snackbar, 
  Alert,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
  GlobalStyles
} from '@mui/material';
import { 
  Google as GoogleIcon, 
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { auth, db, provider } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// CSS to prevent autofill blue background
const globalStyles = (
  <GlobalStyles 
    styles={{
      '@-webkit-keyframes autofill': {
        '0%,100%': {
          color: '#fff',
          background: 'transparent',
        },
      },
      'input:-webkit-autofill': {
        WebkitAnimation: 'autofill 0s forwards',
        animation: 'autofill 0s forwards',
        WebkitTextFillColor: '#fff !important',
        WebkitBoxShadow: '0 0 0px 1000px rgba(25, 25, 40, 0.9) inset !important',
        borderRadius: '0 4px 4px 0 !important',
        caretColor: '#fff !important',
      },
      'input:-webkit-autofill:focus': {
        WebkitTextFillColor: '#fff !important',
        WebkitBoxShadow: '0 0 0px 1000px rgba(30, 30, 46, 0.9) inset !important',
        borderRadius: '0 4px 4px 0 !important',
        caretColor: '#fff !important',
      },
      // For Firefox and others
      'input.MuiInput-input, input.MuiOutlinedInput-input, input.MuiFilledInput-input': {
        background: 'transparent !important',
        color: '#fff !important'
      },
      '.MuiInputBase-root': {
        background: 'transparent !important',
      },
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(144, 202, 249, 0.5)',
      },
      '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#90caf9',
      },
      '.MuiInputBase-input': {
        color: '#fff !important'
      },
      '.auth-input-field': {
        backgroundColor: 'rgba(25, 25, 40, 0.9) !important',
        color: '#fff !important',
        borderRadius: '4px !important',
        '&.Mui-focused': {
          backgroundColor: 'rgba(30, 30, 46, 0.9) !important',
        }
      },
      '.auth-input-icon': {
        color: '#78b6ff !important',
        margin: '0 8px 0 0 !important',
        padding: '0 !important',
      },
      '.auth-input-icon svg': {
        color: '#78b6ff !important',
        fontSize: '24px !important'
      },
    }}
  />
);

function SignInSignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      setSnackbarOpen(true);
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/landing';
    } catch (err) {
      setError("Invalid Email or Password. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setSnackbarOpen(true);
      return;
    }
    
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {globalStyles}
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #2a1a5e 0%, #121212 100%)',
          backgroundAttachment: 'fixed',
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 4 }
        }}
      >
        <Container maxWidth="sm">
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="HangSmart Logo"
              sx={{ 
                width: { xs: 120, sm: 150 }, 
                height: { xs: 120, sm: 150 },
                mb: 2,
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))'
              }}
            />
            <Typography 
              variant="h4" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold', 
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              HangSmart
            </Typography>
          </Box>
          
          <Paper 
            elevation={6} 
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 3, 
              width: '100%',
              maxWidth: 450,
              mx: 'auto',
              border: '1px solid rgba(144, 202, 249, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              background: 'linear-gradient(145deg, #2d1d63 0%, #1e1e2e 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="h4" 
              color="primary" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2
              }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
            
            <Divider sx={{ mb: 3, opacity: 0.6 }} />
            
            {isSignUp && (
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className="auth-input-icon">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                  className: "auth-input-field"
                }}
                inputProps={{
                  sx: {
                    backgroundColor: 'transparent',
                    color: '#ffffff'
                  }
                }}
                sx={{ mb: 2 }}
              />
            )}
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" className="auth-input-icon">
                    <EmailIcon />
                  </InputAdornment>
                ),
                className: "auth-input-field"
              }}
              inputProps={{
                sx: {
                  backgroundColor: 'transparent',
                  color: '#ffffff'
                }
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" className="auth-input-icon">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      size={isMobile ? "small" : "medium"}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
                className: "auth-input-field"
              }}
              inputProps={{
                sx: {
                  backgroundColor: 'transparent',
                  color: '#ffffff'
                }
              }}
              sx={{ mb: 2 }}
            />
            
            {isSignUp && (
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className="auth-input-icon">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  className: "auth-input-field"
                }}
                inputProps={{
                  sx: {
                    backgroundColor: 'transparent',
                    color: '#ffffff'
                  }
                }}
                sx={{ mb: 2 }}
              />
            )}
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={isSignUp ? handleSignUp : handleSignIn}
              sx={{
                mt: 1,
                mb: 2,
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                borderRadius: '28px',
                fontWeight: 'bold'
              }}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              sx={{
                mb: 3,
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                borderRadius: '28px'
              }}
            >
              Continue with Google
            </Button>
            
            <Typography
              variant="body2"
              align="center"
              onClick={handleToggle}
              color="primary"
              sx={{
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': {
                  color: theme => theme.palette.primary.light,
                  textDecoration: 'underline'
                }
              }}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Typography>
          </Paper>
        </Container>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default SignInSignUp;