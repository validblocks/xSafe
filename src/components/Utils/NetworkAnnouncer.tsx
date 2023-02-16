import { Box, useMediaQuery } from '@mui/material';
import { Text } from '../StyledComponents/StyledComponents';
import { XSafeXSymbol } from './XSafeXSymbol';

interface IProps {
    network?: string;
}

const NetworkAnnouncer = ({ network = 'Mainnet' }: IProps) => {
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: maxWidth600 ? 0 : 3 }}>
      <Box
        sx={{
          border: '.5px solid #4c2ffc',
          py: maxWidth600 ? 0 : 0.5,
          pb: '1px',
          px: maxWidth600 ? '5px' : 1.25,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!maxWidth600 && <XSafeXSymbol width={maxWidth600 ? 12 : 20} height={maxWidth600 ? 12 : 20} />}
        <Box display="flex" alignItems="center">
          <Text color="#fff" fontSize={maxWidth600 ? 11 : '14px'} fontWeight="600">{network}</Text>
        </Box>
        <Box display="flex" alignItems="center" pt="2px">
          <Box
            sx={{
              marginLeft: maxWidth600 ? '5px' : '14px',
              boxShadow: '0 0 10px 0.3px #4c2ffc',
              width: maxWidth600 ? '0.35rem' : '0.455rem',
              height: maxWidth600 ? '0.35rem' : '0.455rem',
              borderRadius: '100%',
              backgroundColor: '#4c2ffc',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NetworkAnnouncer;
