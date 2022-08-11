import { IUndelegatedColumn } from 'src/types/staking';
import { Text } from '../StyledComponents/StyledComponents';

interface Props {
    columnData: IUndelegatedColumn;
}

const UndelegatedColumn = ({ columnData: { undelegatedAmount } }: Props) => (
  <Text
    fontSize={15}
    fontWeight={500}
    sx={{ paddingLeft: '0.5rem', color: '#605c73 !important' }}
  >
    {undelegatedAmount} $EGLD
  </Text>
);

export default UndelegatedColumn;
