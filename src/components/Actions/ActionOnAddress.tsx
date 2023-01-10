import { Address } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';
import { Text } from '../StyledComponents/StyledComponents';

type Props = {
  title: string;
  address: Address;
};

const ActionOnAddress = ({ title, address }: Props) => (
  <Box>
    <Text fontSize={21} fontWeight={700} sx={{ marginBottom: '0.75rem' }}>
      <strong>{title}</strong>
    </Text>
    <MemberPresentationWithPhoto
      memberAddress={address}
      charactersLeftAfterTruncation={35}
    />
  </Box>
);

export default ActionOnAddress;
