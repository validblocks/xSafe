import { Grid, Divider, useMediaQuery, Box } from '@mui/material';
import { MultisigCardGrid } from '../StyledComponents/StyledComponents';
import useMultisigDetailsCards from 'src/hooks/useMultisigDetailsCards';
import * as Styled from './styled';

export const SafeDetails = () => {
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const { topSectionCards, bottomSectionCards } = useMultisigDetailsCards();

  const widthBetween520And600 = useMediaQuery(
    '(min-width:520px) and (max-width:600px)',
  );
  return (
    <Box>
      <Styled.DetailsCardContainerBox>
        <Grid
          container
          alignItems="stretch"
          justifyContent={widthBetween520And600 ? 'space-between' : ''}
          gap={'12px'}
        >
          {topSectionCards.map((topCard) => (
            <MultisigCardGrid key={topCard.props.title}>
              {' '}
              {topCard}
            </MultisigCardGrid>
          ))}
        </Grid>
      </Styled.DetailsCardContainerBox>
      <Styled.DetailsCardContainerBox>
        <Grid
          container
          justifyContent={widthBetween520And600 ? 'space-between' : ''}
          gap={'12px'}
          paddingBottom={maxWidth600 ? '35px' : 0}
        >
          {bottomSectionCards.map((bottomCard) => (
            <MultisigCardGrid key={bottomCard.props.title} item>
              {' '}
              {bottomCard}{' '}
            </MultisigCardGrid>
          ))}
        </Grid>
      </Styled.DetailsCardContainerBox>
      <Divider />
    </Box>
  );
};
