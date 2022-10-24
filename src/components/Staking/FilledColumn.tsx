import { IFilledColumn } from 'src/types/staking';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import { useTheme } from 'styled-components';
import PercentageWithIcon from '../Utils/PercentageWithIcon';

interface Props {
    columnData?: IFilledColumn
}

const FilledColumn = ({ columnData: { filledPercentage } = { filledPercentage: 100 } }: Props) => {
  const theme: any = useTheme();

  return (
    <PercentageWithIcon
      icon={<ContrastRoundedIcon sx={{ color: `${theme.palette.text.primary} !important` }} />}
      percentage={filledPercentage === Infinity ? 'Uncapped' : filledPercentage.toString()}
    />
  );
};

export default FilledColumn;
