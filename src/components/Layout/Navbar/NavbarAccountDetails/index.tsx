import React, { useState, useEffect, useCallback } from 'react';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'assets/img/safe.png';
import CopyButton from 'components/CopyButton';
import ReceiveModal from 'components/ReceiveModal';
import SafeOptions from 'components/SafeOptions';
import { uniqueContractAddress } from 'multisigConfig';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import './navbarAccountDetails.scss';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { network } from 'config';
import {
  setMultisigBalance,
  setOrganizationTokens
} from 'redux/slices/accountSlice';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { TokenWithPrice } from 'pages/Organization/types';
import { priceSelector } from 'redux/selectors/economicsSelector';
import TotalBalance from '../TotalBalance';

const NavbarAccountDetails = ({ uniqueAddress }: { uniqueAddress: string }) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [showQr, setShowQr] = useState(false);

  const egldPrice = useSelector(priceSelector);

  const proxy = getNetworkProxy();
  const getTokenPrice = useCallback(
    (tokenIdentifier: string) =>
      tokenPrices.find((tokenWithPrice: TokenWithPrice) => {
        return tokenWithPrice.symbol == tokenIdentifier;
      })?.price ?? egldPrice,
    []
  );
  const {
    tokenPrices,
    membersCountState: [membersCount]
  } = useOrganizationInfoContext();

  const fetchTokenPhotoUrl = useCallback(async (tokenIdentifier: string) => {
    const { data } = await axios.get(
      `${network.apiAddress}/tokens/${tokenIdentifier}`
    );

    return data.assets.pngUrl;
  }, []);

  useEffect(() => {
    (async function getTokens() {
      let isMounted = true;

      if (!currentContract?.address)
        return () => {
          isMounted = false;
        };

      const getEgldBalancePromise = currentContract?.address
        ? proxy.getAccount(new Address(currentContract?.address))
        : {};

      const getAllOtherTokensPromise = axios.get(
        `${network.apiAddress}/accounts/${currentContract?.address}/tokens`
      );

      try {
        const [{ balance: egldBalance }, { data: otherTokens }] =
          await Promise.all([getEgldBalancePromise, getAllOtherTokensPromise]);

        if (!isMounted) return;

        dispatch(setMultisigBalance(JSON.stringify(egldBalance)));

        const allTokens = [
          { ...egldBalance.token, balance: egldBalance.value.toString() },
          ...otherTokens
        ];

        const tokensWithPrices = [];

        for (const [idx, token] of Object.entries(allTokens)) {
          const priceOfCurrentToken = getTokenPrice(token.identifier ?? '');

          const { owner, ...tokenWithoutOwner } = token;

          let photoUrl = '';

          if (token.identifier !== 'EGLD')
            photoUrl = await fetchTokenPhotoUrl(token.identifier as string);

          tokensWithPrices.push({
            ...tokenWithoutOwner,
            presentation: {
              tokenIdentifier: token.identifier,
              photoUrl
            },
            id: idx,
            balanceDetails: {
              photoUrl,
              identifier: token.identifier?.split('-')[0] ?? '',
              amount: token.balance as string,
              decimals: token.decimals as number
            },
            value: {
              tokenPrice: priceOfCurrentToken,
              decimals: token.decimals as number,
              amount: token.balance as string
            }
          });
        }

        dispatch(setOrganizationTokens(tokensWithPrices));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentContract]);

  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);

  const handleQrModal = () => {
    setShowQr(!showQr);
  };

  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options
      })
    );

  const closeSafeDropdown = (data: boolean) => {
    setOpenedSafeSelect(data);
  };

  return (
    <Box className='navbar-account-details'>
      <Box sx={{ textAlign: 'center' }}>
        <Box>
          <img src={Safe} width='91px' height='91px' />
        </Box>
        <Box>
          <Box className='members-box'>
            <Typography>
              {membersCount} {membersCount == 1 ? 'Member' : 'Members'}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ pt: 1 }}
          className='d-flex justify-content-center align-items-center'
        >
          <Typography align='center'>{uniqueAddress}</Typography>
          {openedSafeSelect === true && (
            <Box>
              <ArrowDropUpIcon
                onClick={() => {
                  setOpenedSafeSelect(false);
                }}
              />
              <SafeOptions closeSafeDropdown={closeSafeDropdown} />
            </Box>
          )}
          {openedSafeSelect === false && (
            <Box>
              <ArrowDropDownIcon
                onClick={() => {
                  setOpenedSafeSelect(true);
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pt: 1 }}>
        <Box onClick={handleQrModal} sx={{ mx: 1, cursor: 'pointer' }}>
          <QrCode2Icon />
        </Box>
        <Box className={'copy-btn'} sx={{ mx: 1 }}>
          <CopyButton text={uniqueContractAddress} />
        </Box>
        <Box sx={{ mx: 1 }}>
          <a
            href={`https://devnet-explorer.elrond.com/accounts/${uniqueContractAddress}`}
            target='_blank'
            rel='noreferrer'
            className='explorer-link'
          >
            <ContentPasteSearchIcon />
          </a>
        </Box>
        <ReceiveModal
          showQrFromSidebar={showQr}
          address={currentContract?.address}
          handleQr={handleQrModal}
        />
      </Box>
      <Box sx={{ mt: 2 }} className='d-flex justify-content-center'>
        <Box sx={{ px: 2 }} className='read-only-wrapper'>
          <Typography>Read-only</Typography>
        </Box>
      </Box>
      <TotalBalance />
      <Box className='d-flex justify-content-center' sx={{ pb: 1 }}>
        <Button
          className='new-transfer-btn'
          variant='outlined'
          onClick={onAddBoardMember}
        >
          New Transaction
        </Button>
      </Box>
    </Box>
  );
};

export default NavbarAccountDetails;
