// HomePage.tsx
import React from 'react';
import DilemmaForm from './DilemmaForm';
import Box from '@mui/material/Box';
import logo from './logo.svg';

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <img src={logo} alt="Logo" style={{ marginBottom: '1rem' }} />
      <DilemmaForm onSubmit={(dilemma) => console.log(dilemma)} />
    </Box>
  );
};

export default HomePage;
