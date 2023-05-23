import { Box, useMediaQuery } from '@mui/material';
import { Text } from '../StyledComponents/StyledComponents';
import { XSafeXSymbol } from './XSafeXSymbol';

interface IProps {
  network?: string;
}

const NetworkAnnouncer = ({ network = 'Mainnet' }: IProps) => {
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: maxWidth600 ? 0 : 3,
        pl: 0,
      }}
    >
      <Box
        sx={{
          border: '.5px solid #4c2ffc',
          py: maxWidth600 ? 0 : 0.5,
          pb: maxWidth600 ? '2px' : '4px',
          pl: maxWidth600 ? '5px' : 1.25,
          pr: maxWidth600 ? '9px' : 1.25,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: maxWidth600 ? 'row-reverse' : 'row',
        }}
      >
        {!maxWidth600 && (
          <XSafeXSymbol
            width={maxWidth600 ? 12 : 20}
            height={maxWidth600 ? 12 : 20}
          />
        )}
        <Box display="flex" alignItems="center" mt="2px">
          <Text fontSize={maxWidth600 ? 11 : '14px'} fontWeight="600">
            {network}
          </Text>
        </Box>
        <Box display="flex" alignItems="center" pt="2px">
          <Box
            sx={{
              marginLeft: maxWidth600 ? '0' : '14px',
              marginRight: maxWidth600 ? '5px' : '0',
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
