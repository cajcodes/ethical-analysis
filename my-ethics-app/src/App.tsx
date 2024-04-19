// src/App.tsx
import React, { useState } from 'react';
import DilemmaForm from './components/DilemmaForm';
import { analyzeDilemma } from './api'; // Import analyzeDilemma
import { xml2js } from 'xml-js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from './logo.svg';

const App: React.FC = () => {
  const [steps, setSteps] = useState<any[]>([]);
  const [response, setResponse] = useState(''); // Add a state variable for response

  const handleSubmit = async (dilemma: string) => {
    try {
      await analyzeDilemma(dilemma); // Pass setResponse as an argument
      // You can remove the code related to xml2js and steps extraction
      // since it's now handled in the analyzeDilemma function
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <img src={logo} alt="Logo" style={{ height: '80px' }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Ethical Dilemma Analyzer
        </Typography>
      </Box>
      <DilemmaForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default App;
