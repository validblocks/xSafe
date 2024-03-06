import { Box, Divider, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { IdentityWithColumns } from 'src/types/staking';
import { Text } from '../StyledComponents/StyledComponents';
import APRColumn from './APRColumn';
import FilledColumn from './FilledColumn';
import ProviderColumn from './ProviderColumn';

interface Props {
  provider?: IdentityWithColumns;
}

const ProviderPresentation = ({ provider }: Props) => {
  const minWidth480 = useMediaQuery('(min-width: 480px)');

  const tabletTopBox = useMemo(() => {
    if (minWidth480) {
      return {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      };
    }
    return {
      width: '100%',
      display: 'flex',
      alignItems: 'start',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '10px',
    };
  }, [minWidth480]);

  if (!provider) {
    return <Box my={2}>No provider to show</Box>;
  }

  return (
    <Box height={68} sx={tabletTopBox}>
      <ProviderColumn columnData={provider.providerColumn} />
      <Box
        sx={{
          display: 'flex',
          gap: '12px',
          width: minWidth480 ? 'auto' : '100%',
          alignItems: 'center',
          justifyContent: minWidth480 ? '' : 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {!minWidth480 && <Text mr={0.5}>APR:</Text>}
          <APRColumn columnData={provider.aprColumn} />
        </Box>
        <Divider
          orientation="vertical"
          sx={{ borderColor: '#312870', height: '60%' }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {!minWidth480 && <Text mr={0.5}>Fill:</Text>}
          <FilledColumn columnData={provider.filledColumn} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderPresentation;
