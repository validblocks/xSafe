import { Address } from '@elrondnetwork/erdjs/out';
import { Box, Typography } from '@mui/material';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';

type Props = {
  title: string;
  address: Address;
};

const ActionOnAddress = ({ title, address }: Props) => (
  <Box>
    <Typography variant="h5" sx={{ marginBottom: '0.75rem' }}>
      <strong>{title}</strong>
    </Typography>
    <MemberPresentationWithPhoto
      memberAddress={address}
      charactersLeftAfterTruncation={35}
    />
  </Box>
);

export default ActionOnAddress;
