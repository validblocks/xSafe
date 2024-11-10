import { Box, Checkbox, CircularProgress } from '@mui/material';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  CenteredBox,
  Text,
} from 'src/components/StyledComponents/StyledComponents';
import { network } from 'src/config';
import { CopyIconLink } from 'src/components/Utils/styled';
import { setHasUnknownOwner } from 'src/redux/slices/multisigContractsSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentMultisigContractSelector,
  hasUnknownOwnerSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import CopyButton from 'src/components/Utils/CopyButton';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import SearchIcon from '@mui/icons-material/Search';
import { FinalStepActionButton } from 'src/components/Theme/StyledComponents';
import { useContractData } from 'src/hooks/useContractData';
import { useFullRowAddressCut } from 'src/hooks/useFullRowAddressCut';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import * as Styled from '../../Utils/styled/index';
import {
  useGetAccountInfo,
  useGetPendingTransactions,
  useTrackTransactionStatus,
} from 'src/hooks/sdkDappHooks';

const ChangeOwnerModalContent = () => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const address = currentContract?.address;
  const [sessionId] = useState<string | null>(null);

  const { address: walletAddress } = useGetAccountInfo();

  const onSignChangeContractOwner = useCallback(async () => {
    try {
      if (!address) {
        console.debug('No address found while trying to change owner');
        return;
      }
    } catch (error) {
      console.error('An error occurred, please try again', error);
    }

    return null;
  }, [address]);

  const updateOwnership = useCallback(async () => {
    const contractDetails = await MultiversxApiProvider.getAccountDetails(
      currentContract?.address,
    );
    const isItsOwnOwner =
      contractDetails?.ownerAddress === contractDetails?.address;
    dispatch(setHasUnknownOwner(!isItsOwnOwner));
  }, [currentContract?.address, dispatch]);

  useTrackTransactionStatus({
    transactionId: sessionId,
    onSuccess: () => {
      updateOwnership();
      dispatch(setProposeModalSelectedOption(null));
    },
    onCancelled: () => {
      updateOwnership();
      dispatch(setProposeModalSelectedOption(null));
    },
    onTimedOut: () => {
      updateOwnership();
      dispatch(setProposeModalSelectedOption(null));
    },
    onFail: () => {
      updateOwnership();
      dispatch(setProposeModalSelectedOption(null));
    },
  });

  const { charsLeft } = useFullRowAddressCut();

  const { isLoading, contractData } = useContractData();

  const pendingTransactions = useGetPendingTransactions();
  const hasUnknownOwner = useSelector(hasUnknownOwnerSelector);

  const safeOwnerAddress = useMemo(() => {
    let baseAddress = walletAddress;
    if (hasUnknownOwner) {
      baseAddress = contractData?.ownerAddress ?? '';
    }
    return truncateInTheMiddle(baseAddress, charsLeft);
  }, [charsLeft, contractData?.ownerAddress, hasUnknownOwner, walletAddress]);

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  if (isLoading) {
    return (
      <CenteredBox
        sx={{
          justifyContent: 'center !important',
          minHeight: '280px',
          width: '100%',
        }}
      >
        <CircularProgress
          sx={{
            '&.MuiCircularProgress-root': {
              color: '#4C2FFCF0 !important',
            },
          }}
        />
      </CenteredBox>
    );
  }

  return (
    <Box>
      <Box>
        <Box marginTop="21px">
          <Text> Safe owner address:</Text>
          <Box
            display={'flex'}
            my={1}
            border={'1px solid #eee'}
            p={1}
            borderRadius={'10px'}
          >
            <Text>{safeOwnerAddress}</Text>
            <Box sx={{ mr: 1.35, ml: 1.35 }}>
              <CopyButton text={walletAddress} link={CopyIconLink} />
            </Box>
            <Box>
              <Anchor
                href={`${network.explorerAddress}/accounts/${walletAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <SearchIcon sx={{ color: '#6C757D !important' }} />
              </Anchor>
            </Box>
          </Box>
        </Box>
        <Box pt={2}>
          <Text> Your safe smart contract addresss:</Text>
          <Box
            display={'flex'}
            my={1}
            border={'1px solid #eee'}
            p={1}
            borderRadius={'10px'}
          >
            <Text>{truncateInTheMiddle(contractData?.address ?? '', 20)}</Text>
            <Box sx={{ mr: 1.35, ml: 1.35 }}>
              <CopyButton text={walletAddress} link={Styled.CopyIconLink} />
            </Box>
            <Box>
              <Anchor
                href={`${network.explorerAddress}/accounts/${walletAddress}`}
                target="_blank"
                rel="noreferrer"
                color="#6c757d"
              >
                <SearchIcon />
              </Anchor>
            </Box>
          </Box>
          <ul
            className={
              isDarkThemeEnabled ? 'deploy-safe-ul__dark' : 'deploy-safe-ul'
            }
          >
            <li>
              <Text mt={2} mb={1} sx={{ opacity: 0.5 }}>
                As the deployer of the safe smart contract, you are the initial
                owner.
              </Text>
            </li>
            <li>
              <Text sx={{ opacity: 0.5 }}>
                It is very important to transfer the ownership of the safe smart
                contract to itself, so that any future upgrades can only be
                triggered through a smart contract proposal.
              </Text>
            </li>
          </ul>
          <Box display="flex" alignItems="center" pt={1} mb="21px">
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              sx={{
                padding: 0,
                marginRight: '5px',
                color: isDarkThemeEnabled ? '#fff' : '',
                '&.Mui-checked': {
                  color: '#fff !important',
                },
              }}
              inputProps={{
                'aria-label': 'controlled',
              }}
            />
            <Text>
              I understand the necessity of transferring the ownership
            </Text>
          </Box>
        </Box>
        <FinalStepActionButton
          disabled={
            contractData?.ownerAddress !== walletAddress ||
            !checked ||
            isLoading ||
            pendingTransactions.hasPendingTransactions
          }
          onClick={() => onSignChangeContractOwner()}
        >
          {pendingTransactions.hasPendingTransactions ? (
            <Box
              sx={{
                fontWeight: 'bold',
                display: 'inline-block',
                fontSize: '15px',
                clipPath: 'inset(0 1ch 0 0)',
                animation: 'l 1s steps(4) infinite',
                '@keyframes l': {
                  to: {
                    clipPath: 'inset(0 -1ch 0 0)',
                  },
                },
              }}
            >
              Changing Owner...
            </Box>
          ) : (
            <Text>Change owner</Text>
          )}
        </FinalStepActionButton>
      </Box>
    </Box>
  );
};

export default ChangeOwnerModalContent;
