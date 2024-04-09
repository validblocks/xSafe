import { CircularProgress, useMediaQuery } from '@mui/material';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { CardSkeleton } from '../Skeletons/CardSkeleton';
import {
  CardTitle,
  MultisigCard,
  Text,
} from '../StyledComponents/StyledComponents';

interface Props {
  title: string;
  amountValue?: number;
  amountUnityMeasure: string;
  actionButton?: React.ReactElement | null;
  needsDollarSign?: boolean;
  isLoading?: boolean;
}

const AmountWithTitleCard = ({
  amountValue,
  title = 'Unknown',
  amountUnityMeasure = '',
  actionButton = null,
  needsDollarSign = true,
  isLoading = false,
}: Props) => {
  const t = useCustomTranslation();

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  if (Number.isNaN(amountValue)) return <CardSkeleton />;

  const cardAmount =
    amountValue || amountValue === 0
      ? Number(amountValue).toLocaleString('EN')
      : '';

  return (
    <MultisigCard>
      <CardTitle
        fontSize="15px"
        color="black.main"
        marginBottom="12px"
        fontWeight={500}
      >
        {t(title) as string}:
      </CardTitle>

      {isLoading ? (
        <CircularProgress
          size={30}
          sx={{
            '&.MuiCircularProgress-root': {
              color: '#4c2FFC !important',
            },
          }}
        />
      ) : (
        <Text
          fontSize={maxWidth600 ? '20px' : '24px'}
          fontWeight="bolder"
          sx={{ display: 'flex', gap: 1 }}
        >
          {`${cardAmount} ${needsDollarSign ? '$' : ''}${amountUnityMeasure}`}
        </Text>
      )}
      {actionButton}
    </MultisigCard>
  );
};

export default AmountWithTitleCard;
