import { IClaimableRewardsColumn } from 'src/types/staking';
import { Text } from '../StyledComponents/StyledComponents';

interface Props {
    columnData: IClaimableRewardsColumn;
}

const ClaimableRewardsColumn = ({ columnData: { claimableRewards = '0' } }: Props) => (
  <Text
    fontSize={15}
    fontWeight={500}
    sx={{ paddingLeft: '0.5rem', color: '#08041D !important' }}
  >
    {claimableRewards} $EGLD
  </Text>
);

export default ClaimableRewardsColumn;
