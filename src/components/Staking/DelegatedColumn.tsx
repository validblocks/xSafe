import { IDelegatedColumn } from 'src/types/staking';
import { Text } from '../StyledComponents/StyledComponents';

interface Props {
    columnData: IDelegatedColumn;
}

const DelegatedColumn = ({ columnData: { delegatedAmount } }: Props) => (
  <Text
    fontSize={15}
    fontWeight={500}
    sx={{ paddingLeft: '0.5rem', color: '#08041D !important' }}
  >
    {delegatedAmount} $EGLD
  </Text>
);

export default DelegatedColumn;
