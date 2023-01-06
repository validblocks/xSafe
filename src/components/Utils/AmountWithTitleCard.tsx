import { useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardSkeleton } from '../Skeletons/CardSkeleton';
import { MultisigCard, Text } from '../StyledComponents/StyledComponents';

interface Props {
  title: string;
  amountValue: string;
  amountUnityMeasure: string;
  actionButton?: React.ReactElement | null;
  needsDollarSign?: boolean;
}

const AmountWithTitleCard = ({
  amountValue = '0',
  title = 'Unknown',
  amountUnityMeasure = '',
  actionButton = null,
  needsDollarSign = true,
}: Props) => {
  const { t } = useTranslation();

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  if (amountValue === 'NaN') return <CardSkeleton />;

  return (
    <MultisigCard>
      <Text fontSize="15px" color="black.main" marginBottom="12px">{t(title) as string}:</Text>
      <Text fontSize={maxWidth600 ? '20px' : '24px'} fontWeight="bolder" sx={{ display: 'flex', gap: 1 }}>
        {(`${amountValue} ${needsDollarSign ? '$' : ''}${amountUnityMeasure}`)}
      </Text>
      {actionButton}
    </MultisigCard>
  );
};

export default AmountWithTitleCard;
