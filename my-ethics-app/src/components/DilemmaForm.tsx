// src/components/DilemmaForm.tsx
import React, { useState, useEffect } from'react';
import Modal from './Modal';
import { analyzeDilemma } from '../api';
import { evaluateStep } from '../api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { getPrompts } from '../api';

interface DilemmaFormProps {
  onSubmit: (dilemma: string) => void;
}

const STEPS = [
  "Identify the Issue",
  "Apply Ethical Lens",
  "Define the Dilemma",
  "Explore Options",
  "Weigh Consequences",
  "Ethical Verdict",
];

  const DilemmaForm: React.FC<DilemmaFormProps> = ({ onSubmit }) => {
    const [dilemma, setDilemma] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [response, setResponse] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [evaluationScores, setEvaluationScores] = useState<{ [key: number]: number }>({});
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [prompts, setPrompts] = useState<string[]>([]);

    useEffect(() => {
      const fetchPrompts = async () => {
        try {
          const fetchedPrompts = await getPrompts();
          const parsedPrompts = fetchedPrompts.map(([prompt]) => {
            const parsedPrompt = prompt.match(/<prompt>(.*?)<\/prompt>/s)?.[1] || '';
            return parsedPrompt;
          });
          setPrompts(parsedPrompts);
        } catch (error) {
          console.error('Error fetching prompts:', error);
        }
      };
    
      fetchPrompts();
    }, []);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      try {
        const response = await analyzeDilemma(dilemma);
        const analysis = response.data.analysis;
        const steps = [
          analysis.match(/<problem>(.*?)<\/problem>/s)?.[1] || '',
          analysis.match(/<principles>(.*?)<\/principles>/s)?.[1] || '',
          analysis.match(/<dimensions>(.*?)<\/dimensions>/s)?.[1] || '',
          analysis.match(/<actions>(.*?)<\/actions>/s)?.[1] || '',
          analysis.match(/<consequences>(.*?)<\/consequences>/s)?.[1] || '',
          analysis.match(/<answer>(.*?)<\/answer>/s)?.[1] || '',
        ];
        console.log('Steps received from Flask app:', steps);
        setSteps(steps);
        setResponse(analysis);
        setIsOpen(true);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setDilemma('');
        setIsLoading(false);
      }
    };
  
    const handleClose = () => {
      setIsOpen(false);
    };
  
    const handleNextStep = () => {
      setCurrentStepIndex((prevIndex) => prevIndex + 1);
    };

    const renderCurrentStep = () => {
      if (prompts.length === 0) {
        return <Typography variant="body1">No prompts available</Typography>;
      }
    
      const originalPrompt = prompts[currentStepIndex];
    
      let stepResponse = steps[currentStepIndex] || ''; // Get the step response from the steps array

      // Accessing the evaluation score for the current step
      const evaluationScore = evaluationScores[currentStepIndex];
    
      const rubricPrompt = `Evaluate the effectiveness of the provided prompt in eliciting high-quality responses. Consider the clarity, specificity, and relevance of the prompt in guiding the responder to provide a suitable response.
      Criteria for Evaluation:
      1. Clarity (0-20 points): Is the prompt clear and easily understandable? Does it convey the desired task or objective clearly to the responder?
      2. Specificity (0-20 points): Does the prompt provide specific guidelines or instructions to the responder? Are there clear expectations outlined in the prompt regarding the content or format of the response?
      3. Relevance (0-20 points): Is the prompt relevant to the context or topic at hand? Does it address key aspects or considerations pertinent to the subject matter?
      4. Engagement (0-20 points): Does the prompt engage the responder and encourage thoughtful reflection or analysis? Does it inspire creativity or critical thinking in formulating a response? 
      5. Ethical Considerations (0-20 points): Does the prompt adhere to ethical principles, considering the well-being of all stakeholders involved? Are there any potential biases or sensitivities addressed in the prompt to ensure fairness and inclusivity?
      Total Score: 0-100      
      Please evaluate the given prompt based on the criteria above and provide a score out of 100.`;
    
      const handleEvaluateClick = async (stepIndex: number) => {
        setIsEvaluating(true);
        try {
          const stepResponse = steps[stepIndex] || ''; // Get the step response from the steps array
          const score = await evaluateStep(
            originalPrompt,
            stepResponse,
            rubricPrompt
          );
          setEvaluationScores((prevScores) => ({
            ...prevScores,
            [stepIndex]: score,
          }));
        } catch (error) {
          console.error('Error evaluating step:', error);
        }
        setIsEvaluating(false);
      };

      return (
        <div>
          <Typography variant="h6" gutterBottom>
            {STEPS[currentStepIndex]}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {originalPrompt}
          </Typography>
          <Typography variant="body1">{stepResponse}</Typography>
          {evaluationScore === undefined ? (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              {isEvaluating ? (
                <CircularProgress size={24} sx={{ mr: 1 }} />
              ) : null}
              <Button onClick={() => handleEvaluateClick(currentStepIndex)} disabled={isEvaluating}>
                Evaluate Prompt
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Score: {evaluationScore}</Typography>
            </Box>
          )}
          {currentStepIndex < steps.length - 1 && (
            <Button onClick={() => handleNextStep()} sx={{ mt: 2 }}>
              Next Step
            </Button>
          )}
        </div>
      );
    };
  
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 1 }}>
              Analyzing...
            </Typography>
          </Box>
        )}
        <TextField
          value={dilemma}
          onChange={(event) => setDilemma(event.target.value)}
          multiline
          rows={4}
          variant="outlined"
          label="Enter your ethical dilemma"
          fullWidth
          sx={{ mb: 2 }}
        />
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            Error: Please try again.
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button onClick={() => setDilemma('')} variant="outlined" color="secondary">
            Clear
          </Button>
        </Box>
        <Modal isOpen={isOpen} onClose={handleClose} isLoading={isLoading}>
          {renderCurrentStep()}
        </Modal>
      </Box>
    );
  };
  
  export default DilemmaForm;
  