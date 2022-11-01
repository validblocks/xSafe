/* eslint-disable no-nested-ternary */
import {
  getAccountProviderType,
  sendTransactions,
  transactionServices,
  useGetLoginInfo,
} from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyButton from 'src/components/CopyButton';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { CenteredBox, Text } from 'src/components/StyledComponents/StyledComponents';
import { useMultistepFormContext } from 'src/components/Utils/MultistepForm';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
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

  const providerType = getAccountProviderType();
  const { pendingDeploymentData: { pendingDeploymentContractData } } =
    useMultisigCreationFormContext();

  const {
    setIsFinalStepButtonActive,
    setBuiltFinalActionHandler,
  } = useMultistepFormContext();

  const multisigContracts = useSelector(multisigContractsSelector);

  const onSignChangeContractOwner = useCallback(async () => {
    const address = Address.fromBech32(pendingDeploymentContractData?.multisigAddress);
    try {
      const data = `ChangeOwnerAddress@${address.hex()}`;

      const transaction = buildBlockchainTransaction(
        0,
        providerType,
        new Address(pendingDeploymentContractData?.multisigAddress),
        data,
        gasLimit,
      );
      const { sessionId } = await sendTransactions({ transactions: transaction });
      setSessionId(sessionId);

      return sessionId;
    } catch (error) {
      console.error('An error occurred, please try again');
    }

    return null;
  }, [pendingDeploymentContractData?.multisigAddress, providerType]);

  useEffect(() => {
    setIsFinalStepButtonActive(true);
    setBuiltFinalActionHandler(() => () => onSignChangeContractOwner());
  }, [onSignChangeContractOwner, setBuiltFinalActionHandler, setIsFinalStepButtonActive]);

  const theme: any = useTheme();

  transactionServices.useTrackTransactionStatus({
    transactionId: sessionId,
    onSuccess: () => {
      const [lastContract] = multisigContracts.slice(-1);
      handleClose();
      dispatch(setCurrentMultisigContract(lastContract.address));
      navigate(`${routeNames.multisig}/${lastContract.address}`);
    },
  });

  const pendingTransactions = transactionServices.useGetPendingTransactions();

  useEffect(() => {
    setIsLoading(pendingTransactions.hasPendingTransactions);
  }, [pendingTransactions.hasPendingTransactions]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="card">
      <Box>
        <CenteredBox px={5} textAlign="left" borderBottom={`1px solid ${theme.palette.borders.secondary}`}>
          <Text
            width="100%"
            textAlign={'left'}
            py={2}
            fontSize={22}
          >
            {t('Create a new Safe') as string}
          </Text>
          <Text
            width="100%"
            textAlign={'left'}
            py={2}
            fontSize={12}
          >
            {t('Step 2 of 2') as string}
          </Text>
        </CenteredBox>
        <Box pt={3} px={5}>
          <Text fontSize={21} fontWeight={500}>Safe deployed! One more step... </Text>
          <Text sx={{ opacity: 0.5 }} fontSize={16} fontWeight={500} my={2}>Your Safe has been created!</Text>
          <Text> Your Safe wallet address:</Text>
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
                <ContentPasteGoOutlinedIcon />
              </Anchor>
            </Box>
          </Box>
          <Text mt={2} sx={{ opacity: 0.5 }}>
            This step is very important, as it allows the safe to handle all future upgrades through proposals
          </Text>

        </Box>
        <Box py={3} px={5}>
          <FinalStepActionButton
            disabled={!isLoggedIn || isLoading}
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
