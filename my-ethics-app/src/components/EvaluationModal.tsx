import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationResponse: string;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  onClose,
  evaluationResponse,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        outline: 'none',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Evaluation
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" gutterBottom>
          {evaluationResponse}
        </Typography>
      </Box>
    </Modal>
  );
};

export default EvaluationModal;