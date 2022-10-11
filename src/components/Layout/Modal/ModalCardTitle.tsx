import { ModalCardTitleContainer, Text } from 'src/components/StyledComponents/StyledComponents';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTheme } from 'styled-components';
import { Box, Typography, IconButton } from '@mui/material';

interface IProps {
    title: React.ReactNode;
    handleClose: () => void;
    activeStepNumber: number;
    totalSteps?: number;
}
const ModalCardTitle = ({ title, handleClose, activeStepNumber = 0, totalSteps = 0 }: IProps) => {
  const theme: any = useTheme();
  return (
    <ModalCardTitleContainer sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Text fontSize="24px" sx={{ '&:first-letter': { textTransform: 'uppercase !important' } }}> {title}</Text>
        <Typography sx={{ mt: '0.3rem' }}>
          {totalSteps > 0 && <Text color="black.main" fontSize="12px"> Step {activeStepNumber} of {totalSteps}</Text>}
        </Typography>
      </Box>
      <IconButton
        onClick={handleClose}
        size="small"
        aria-label="close"
      >
        <CloseRoundedIcon sx={{ color: theme.palette.text.primary }} />
      </IconButton>
    </ModalCardTitleContainer>
  );
};

export default ModalCardTitle;
