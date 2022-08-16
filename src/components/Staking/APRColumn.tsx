import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import { IAPRColumn } from 'src/types/staking';
import PercentageWithIcon from '../Utils/PercentageWithIcon';

interface Props {
    columnData: IAPRColumn
}

const APRColumn = ({ columnData: { apr } }: Props) => (
  <PercentageWithIcon
    icon={<MonetizationOnRoundedIcon sx={{ color: 'rgba(8, 4, 29, 0.54)' }} />}
    percentage={apr.toString()}
  />
);

export default APRColumn;
