import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import { IAPRColumn } from 'src/types/staking';
import { useCustomTheme } from 'src/utils/useCustomTheme';
import PercentageWithIcon from '../Utils/PercentageWithIcon';

interface Props {
    columnData?: IAPRColumn
}

const APRColumn = ({ columnData: { apr } = { apr: 0 } }: Props) => {
  const theme = useCustomTheme();
  return (
    <PercentageWithIcon
      icon={<MonetizationOnRoundedIcon sx={{ color: theme.palette.svg.primary }} />}
      percentage={apr?.toString()}
    />
  );
};

export default APRColumn;
