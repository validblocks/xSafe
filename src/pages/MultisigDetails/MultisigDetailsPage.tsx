import { Address, Balance } from '@elrondnetwork/erdjs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  currentMultisigContractSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { Divider, Grid } from '@mui/material';
import useMultisigDetailsCards from 'src/utils/useMultisigDetailsCards';
import routeNames from 'src/routes/routeNames';
import { parseMultisigAddress } from 'src/utils/addressUtils';
import { useEffect } from 'react';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core';
import * as Styled from './styled';

export interface ContractInfo {
  totalBoardMembers: number;
  totalProposers: number;
  quorumSize: number;
  deployedAt?: string;
  userRole: number;
  allActions: MultisigActionDetailed[];
  multisigBalance: Balance;
  multisigName?: string;
  boardMembersAddresses?: Address[];
  proposersAddresses?: Address[];
}

function MultisigDetailsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useGetLoginInfo();
  const currentContract = useSelector(currentMultisigContractSelector);

  const {
    topSectionCards,
    bottomSectionCards,
  } = useMultisigDetailsCards();

  useEffect(() => {
    if (!isLoggedIn || !currentContract?.address || !parseMultisigAddress(currentContract?.address)) {
      navigate(routeNames.multisig);
    }
  }, [currentContract?.address, isLoggedIn, navigate]);

  return (
    <>
      <Styled.DetailsCardContainerBox>
        <Grid container spacing={2}>
          {topSectionCards.map(
            (topCard) => <Grid key={topCard.props.title} item xs={6} md={4} lg={3}> {topCard} </Grid>,
          )}
        </Grid>
      </Styled.DetailsCardContainerBox>
      <Divider />
      <Styled.DetailsCardContainerBox>
        <Grid container spacing={2}>
          {bottomSectionCards.map(
            (bottomCard) => <Grid key={bottomCard.props.title} item xs={6} md={4} lg={3}> {bottomCard} </Grid>,
          )}
        </Grid>
      </Styled.DetailsCardContainerBox>
      <Divider />
    </>
  );
}

export default MultisigDetailsPage;
