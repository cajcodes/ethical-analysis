// src/App.tsx
import React, { useState } from 'react';
import DilemmaForm from './components/DilemmaForm';
import { analyzeDilemma } from './api'; // Import analyzeDilemma
import { xml2js } from 'xml-js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
      // console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <img src={logo} alt="Logo" style={{ height: '80px', marginTop: '2rem', marginBottom: '2rem' }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Ethical Dilemma Analyzer
        </Typography>
      </Box>
      <DilemmaForm onSubmit={handleSubmit} />
      <Typography variant="h6" align="center" sx={{ marginTop: '3rem' }}>
        Use AI to explore complex moral quandaries by entering scenarios and navigating through Claude-3's chain of thought. 
        Evaluate your prompts and responses to gain insights into ethical prompt engineering.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          href="https://cajcodes.com"
          target="_blank"
          sx={{
            marginTop: '2rem',
            backgroundColor: '#32cd32',
            color: 'black',
            '&:hover': {
              backgroundColor: '#28a428',
            },
          }}
        >
          Try Chatbot Demo
        </Button>
      </Box>
    </Container>
  );
};

export default App;
