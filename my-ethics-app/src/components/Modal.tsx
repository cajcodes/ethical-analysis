import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isLoading: boolean;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onClose, children, isLoading }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          outline: 'none',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
        }}
      >
        <IconButton
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Analyzing...
            </Typography>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;