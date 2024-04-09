import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { Divider, Grid, useMediaQuery } from '@mui/material';
import useMultisigDetailsCards from 'src/hooks/useMultisigDetailsCards';
import routeNames from 'src/routes/routeNames';
import { parseMultisigAddress } from 'src/utils/addressUtils';
import { useEffect } from 'react';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { MultisigCardGrid } from 'src/components/StyledComponents/StyledComponents';
import * as Styled from '../../components/MultisigDetails/styled';

function MultisigDetailsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useGetLoginInfo();
  const currentContract = useSelector(currentMultisigContractSelector);
  const widthBetween520And600 = useMediaQuery(
    '(min-width:520px) and (max-width:600px)',
  );
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const { topSectionCards, bottomSectionCards } = useMultisigDetailsCards();

  useEffect(() => {
    if (
      !isLoggedIn ||
      !currentContract?.address ||
      !parseMultisigAddress(currentContract?.address)
    ) {
      navigate(routeNames.multisig);
    }
  }, [currentContract?.address, isLoggedIn, navigate]);

  return (
    <>
      <Styled.DetailsCardContainerBox>
        <Grid
          container
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
          paddingBottom={maxWidth600 ? '60px' : 0}
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
    </>
  );
}

export default MultisigDetailsPage;
