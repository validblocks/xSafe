/* eslint-disable no-nested-ternary */
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import {
  useGetAccountProvider,
  useGetPendingTransactions,
  useTrackTransactionStatus,
} from '@multiversx/sdk-dapp/hooks';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { Address } from '@multiversx/sdk-core/out';
import { Box, Checkbox } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyButton from 'src/components/CopyButton';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { CenteredBox, Text } from 'src/components/StyledComponents/StyledComponents';
import { useMultistepFormContext } from 'src/components/Utils/MultistepForm';
import SearchIcon from '@mui/icons-material/Search';
import { gasLimit, network } from 'src/config';
import { buildBlockchainTransaction } from 'src/contracts/transactionUtils';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  multisigContractsSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import routeNames from 'src/routes/routeNames';
import { useNavigate } from 'react-router-dom';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { FinalStepActionButton } from 'src/components/Theme/StyledComponents';
import { useMultisigCreationFormContext } from './DeployMultisigModal';
import * as Styled from '../../components/Utils/styled/index';

interface DeployStepsModalType {
    handleClose: () => void;
}

const DeployMultisigStepTwo = ({
  handleClose,
}: DeployStepsModalType) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useGetLoginInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { providerType } = useGetAccountProvider();
  const { pendingDeploymentData: { pendingDeploymentContractData } } =
    useMultisigCreationFormContext();

  const {
    setIsFinalStepButtonActive,
    setBuiltFinalActionHandler,
  } = useMultistepFormContext();

  const multisigContracts = useSelector(multisigContractsSelector);

  const onSignChangeContractOwner = useCallback(async () => {
    try {
      const contractAddress = pendingDeploymentContractData?.multisigAddress;
      const address = new Address(contractAddress);
      const data = `ChangeOwnerAddress@${address.hex()}`;

      const transaction = await buildBlockchainTransaction(
        0,
        providerType,
        address,
        data,
        gasLimit,
      );

      const { sessionId } = await sendTransactions({ transactions: [transaction] });
      setSessionId(sessionId);

      return sessionId;
    } catch (error) {
      console.error('An error occurred, please try again', error);
    }

    return null;
  }, [pendingDeploymentContractData, providerType]);

  useEffect(() => {
    setIsFinalStepButtonActive(true);
    setBuiltFinalActionHandler(() => () => onSignChangeContractOwner());
  }, [onSignChangeContractOwner, setBuiltFinalActionHandler, setIsFinalStepButtonActive]);

  const theme: any = useTheme();

  useTrackTransactionStatus({
    transactionId: sessionId,
    onSuccess: () => {
      const [lastContract] = multisigContracts.slice(-1);
      handleClose();
      dispatch(setCurrentMultisigContract(lastContract.address));
      navigate(`${routeNames.multisig}/${lastContract.address}`);
    },
  });

  const pendingTransactions = useGetPendingTransactions();

  useEffect(() => {
    setIsLoading(pendingTransactions.hasPendingTransactions);
  }, [pendingTransactions.hasPendingTransactions]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="card">
      <Box>
        <CenteredBox
          justifyContent="space-between"
          px={5}
          textAlign="left"
          borderBottom={`1px solid ${theme.palette.borders.secondary}`}
        >
          <Text
            width="80%"
            textAlign={'left'}
            py={2}
            fontSize={21}
          >
            {t('Safe deployed! One more step...') as string}
          </Text>
          <Text
            width="20%"
            textAlign="right"
            py={2}
            fontSize={12}
          >
            {t('Step 2 of 2') as string}
          </Text>
        </CenteredBox>
        <Box pt={3} px={5}>
          <Text> Your safe smart contract addresss:</Text>
          <Box display={'flex'} my={1} border={'1px solid #eee'} p={1} borderRadius={'10px'}>
            <Text>
              {truncateInTheMiddle(pendingDeploymentContractData?.multisigAddress, 20)}
            </Text>
            <Box sx={{ mr: 1.35, ml: 1.35 }}>
              <CopyButton text={pendingDeploymentContractData?.multisigAddress} link={Styled.CopyIconLink} />
            </Box>
            <Box>
              <Anchor
                href={`${network.explorerAddress}/accounts/${pendingDeploymentContractData?.multisigAddress}`}
                target="_blank"
                rel="noreferrer"
                color="#6c757d"
              >
                <SearchIcon />
              </Anchor>
            </Box>
          </Box>
          <ul className="deploy-safe-ul">
            <li>
              <Text mt={2} mb={1} sx={{ opacity: 0.5 }}>
                As the deployer of the safe smart contract, you are the initial owner.
              </Text>
            </li>
            <li>
              <Text sx={{ opacity: 0.5 }}>
                It is very important to transfer the ownership of the safe smart contract to itself, so that any future upgrades can only be triggered through a smart contract proposal.
              </Text>
            </li>
          </ul>
          <Box display="flex" alignItems="center" pt={1}>
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              sx={{
                padding: 0,
                marginRight: '5px',
              }}
              inputProps={{
                'aria-label': 'controlled',
              }}
            />
            <Text>I understand the necessity of transferring the ownership</Text>
          </Box>
        </Box>
        <Box py={3} px={5}>
          <FinalStepActionButton
            disabled={!isLoggedIn || isLoading || !checked}
            onClick={() => onSignChangeContractOwner()}
          >
            {isLoading && (
            <Box sx={{
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
            }
 }
            >Changing Owner...
            </Box>
            )}
            { !isLoading ? (isLoggedIn ? 'Change Owner' : 'Login first') : ''}
          </FinalStepActionButton>
        </Box>
      </Box>
    </div>
  );
};

export default DeployMultisigStepTwo;
