import React, { useState } from 'react';
import DilemmaForm from './components/DilemmaForm';
import { analyzeDilemma } from './api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import logo from './logo.svg';
import Footer from './components/Footer';
import styles from './Button.module.css';

const App: React.FC = () => {
  const [steps, setSteps] = useState<any[]>([]);
  const [response, setResponse] = useState('');

  const handleSubmit = async (dilemma: string) => {
    try {
      await analyzeDilemma(dilemma);
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '4rem', // Add padding bottom to container to accommodate footer
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <img src={logo} alt="Logo" style={{ height: '80px', marginTop: '2rem', marginBottom: '2rem' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Ethical Dilemma Analyzer
          </Typography>
        </Box>
        <Box>
          <DilemmaForm onSubmit={handleSubmit} />
        </Box>
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          <Typography variant="h6" align="center" sx={{ marginTop: '3rem', marginBottom: '1rem' }}>
            Use AI to explore complex moral quandaries by entering scenarios and navigating through Claude-3's chain of thought. 
            Evaluate your prompts and responses to gain insights into ethical prompt engineering.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            href="https://cajcodes.com"
            target="_blank"
            className={styles.customButton}
          >
            Try Chatbot Demo
          </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default App;
