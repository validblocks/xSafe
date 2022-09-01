import { ModalCardTitleContainer, Text } from 'src/components/StyledComponents/StyledComponents';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Typography } from '@mui/material';

interface IProps {
    title: React.ReactNode;
    handleClose: () => void;
    activeStepNumber: number;
    totalSteps?: number;
}
const ModalCardTitle = ({ title, handleClose, activeStepNumber = 0, totalSteps = 0 }: IProps) => (
  <ModalCardTitleContainer sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Text fontSize="24px"> {title}</Text>
      <Typography sx={{ mt: '0.3rem' }}>
        {totalSteps > 0 && <Text color="black.main" fontSize="12px"> Step {activeStepNumber} of {totalSteps}</Text>}
      </Typography>
    </Box>
    <CloseRoundedIcon onClick={handleClose} sx={{ mt: '0.25rem' }} />
  </ModalCardTitleContainer>
);

export default ModalCardTitle;
