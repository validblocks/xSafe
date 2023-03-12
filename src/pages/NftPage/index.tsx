import { Box, useMediaQuery } from '@mui/material';
import NftComponent from 'src/components/NftComponent';

const NftPage = () => {
  const width = useMediaQuery('(max-width:600px)');
  return (
    <Box width={'100%'} padding={width ? '0' : '9px'}>
      <NftComponent />
    </Box>
  );
};

export default NftPage;
