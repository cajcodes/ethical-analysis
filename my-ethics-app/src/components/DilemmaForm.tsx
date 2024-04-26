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
import EvaluationModal from './EvaluationModal';

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
    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [evaluationResponse, setEvaluationResponse] = useState('');
    const [score, setScore] = useState(0);

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
    
      const rubricPrompt = `Evaluate the quality of the response in addressing the specific aspect of the ethical dilemma as prompted. Consider how well the response demonstrates understanding, analysis, and reasoning in relation to the given prompt.

      Criteria for Evaluation:
      1. Relevance (0-20 points): Does the response directly address the specific aspect of the ethical dilemma as prompted? Is the content of the response relevant and on-topic?
      
      2. Depth of Analysis: Does the response provide a thorough and well-reasoned analysis of the ethical considerations related to the prompt? Are multiple perspectives and implications considered?
      
      3. Clarity and Coherence: Is the response clear, well-organized, and easy to understand? Does it present a coherent and logical flow of ideas?
      
      4. Ethical Reasoning: Does the response demonstrate sound ethical reasoning and judgment? Are ethical principles and frameworks appropriately applied to the specific aspect of the dilemma?
      
      5. Actionable Insights: Does the response provide practical and actionable insights or recommendations relevant to the prompt? Are the suggested actions or solutions well-justified and ethically sound?
      
      Please evaluate the given response based on the criteria above, considering how effectively it addresses the specific aspect of the ethical dilemma as prompted. Provide a score out of 100.`;
    
      const handleEvaluateClick = async (stepIndex: number) => {
        setIsEvaluating(true);
        try {
          const stepResponse = steps[stepIndex] || '';
          const prompt = `${dilemma} ${originalPrompt}`;
          const responseText = await evaluateStep(prompt, stepResponse, rubricPrompt);
          // console.log('Response Text:', responseText);
          let evaluationResponse = '';
      
          if (responseText) {
            const startTag = '<thinking>';
            const endTag = '</thinking>';
            const startIndex = responseText.indexOf(startTag);
            const endIndex = responseText.indexOf(endTag);
      
            if (startIndex !== -1 && endIndex !== -1) {
              evaluationResponse = responseText.slice(startIndex + startTag.length, endIndex);
            }
          }
      
          // console.log('Evaluation Response:', evaluationResponse);
          setEvaluationResponse(evaluationResponse);
          setIsEvaluationModalOpen(true);
        } catch (error) {
          // console.error('Error evaluating step:', error);
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
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {currentStepIndex > 0 && (
          <Button
            onClick={() => setCurrentStepIndex((prevIndex) => prevIndex - 1)}
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Back
          </Button>
        )}
        {currentStepIndex === steps.length - 1 && (
          <>
            {isEvaluating ? (
              <CircularProgress size={24} sx={{ mb: 2 }} />
            ) : (
              <Button
                onClick={() => handleEvaluateClick(currentStepIndex)}
                disabled={isEvaluating}
                sx={{ mb: 2 }}
                variant="contained"
              >
                Evaluate
              </Button>
            )}
          </>
        )}
        {currentStepIndex < steps.length - 1 && (
          <Button onClick={() => handleNextStep()} variant="contained" color="primary">
            Next Step
          </Button>
        )}
      </Box>
      <EvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        evaluationResponse={evaluationResponse}
      />
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
  