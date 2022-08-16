import { IWithdrawableColumn } from 'src/types/staking';
import { Text } from '../StyledComponents/StyledComponents';

interface Props {
    columnData: IWithdrawableColumn;
}

const WithdrawableColumn = ({ columnData: { withdrawableAmount } }: Props) => (
  <Text
    fontSize={15}
    fontWeight={500}
    sx={{ paddingLeft: '0.5rem', color: '#605c73 !important' }}
  >
    {withdrawableAmount} / 1 $EGLD
  </Text>
);

export default WithdrawableColumn;
