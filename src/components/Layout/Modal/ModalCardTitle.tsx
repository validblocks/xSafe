import { ModalCardTitleContainer, Text } from 'src/components/StyledComponents/StyledComponents';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTheme } from 'styled-components';
import { Box, Typography, IconButton, useMediaQuery } from '@mui/material';

interface IProps {
    title?: React.ReactNode | string;
    handleClose?: () => void;
    activeStepNumber?: number;
    totalSteps?: number;
}
const ModalCardTitle = ({ title, handleClose, activeStepNumber = 0, totalSteps = 0 }: IProps) => {
  const theme: any = useTheme();
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  return (
    <ModalCardTitleContainer sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Text
          fontSize={maxWidth600 && totalSteps > 0 ? '16px' : '24px'}
          sx={{ '&:first-letter': { textTransform: 'uppercase !important' } }}
        > {title}
        </Text>
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
