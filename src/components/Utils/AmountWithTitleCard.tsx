import { Box, CircularProgress, useMediaQuery } from '@mui/material';
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
    amountValue || amountValue === 0 ? Number(amountValue) : '';

  const amountInteger = cardAmount.toString().split('.')?.[0] || 0;
  const amountDecimals = cardAmount.toString().split('.')?.[1] || 0;

  const hasAmountDecimals = !!amountDecimals && amountDecimals !== '0';
  const hasAmountInteger =
    (!!amountInteger && amountInteger !== '0') || hasAmountDecimals;
  const hasNumbers = hasAmountInteger || hasAmountDecimals;

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {hasAmountInteger && (
            <Text
              sx={{
                fontSize: maxWidth600 ? '20px' : '24px',
                lineHeight: maxWidth600 ? '20px' : '34px',
                display: 'flex',
                alignItems: 'flex-end',
                marginLeft: '2px',
                fontWeight: 'bolder',
              }}
            >
              {amountInteger}
            </Text>
          )}
          {hasAmountDecimals && (
            <>
              <Text
                color="#9C9BA580"
                sx={{
                  fontWeight: 'bolder',
                  fontSize: maxWidth600 ? '20px' : '24px',
                  lineHeight: maxWidth600 ? '20px' : '34px',
                }}
              >
                .
              </Text>
              <Text
                variant="caption"
                color="#9C9BA580"
                fontWeight="600"
                sx={{
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginLeft: '2px',
                }}
              >
                {amountDecimals}
              </Text>
            </>
          )}
          <Text
            sx={{
              ml: hasNumbers ? 1 : 0,
              fontWeight: 'bolder',
              fontSize: maxWidth600 ? '20px' : '16px',
              lineHeight: maxWidth600 ? '20px' : '28px',
              ...(hasNumbers && { color: '#9C9BA580' }),
            }}
          >{`${needsDollarSign ? '$' : ''}${amountUnityMeasure}`}</Text>
        </Box>
      )}
      {actionButton}
    </MultisigCard>
  );
};

export default AmountWithTitleCard;
