import { IFilledColumn } from 'src/types/staking';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import PercentageWithIcon from '../Utils/PercentageWithIcon';

interface Props {
    columnData?: IFilledColumn
}

const FilledColumn = ({ columnData: { filledPercentage } = { filledPercentage: 100 } }: Props) => (
  <PercentageWithIcon
    icon={<ContrastRoundedIcon sx={{ color: 'rgba(8, 4, 29, 0.54)' }} />}
    percentage={filledPercentage === Infinity ? 'Uncapped' : filledPercentage.toString()}
  />
);

export default FilledColumn;
