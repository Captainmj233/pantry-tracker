'use client'

import { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to pantry tracker page
      window.location.href = '/pantry'; // Update this if your pantry page is at a different route
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect to pantry tracker page
      window.location.href = '/pantry'; // Update this if your pantry page is at a different route
    } catch (err) {
      setError('Failed to sign in with Google.');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f7f7f7"
      p={3}
    >
      <Typography variant="h4" color="#333" mb={4}>
        Welcome to the Pantry Tracker
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        onClick={handleSignIn}
        sx={{ backgroundColor: '#8bc34a', '&:hover': { backgroundColor: '#7cb342' } }}
      >
        Sign In
      </Button>
      <Button
        variant="contained"
        onClick={handleGoogleSignIn}
        sx={{ marginTop: 2, backgroundColor: '#4285F4', '&:hover': { backgroundColor: '#357ae8' } }}
      >
        Sign In with Google
      </Button>
    </Box>
  );
}
