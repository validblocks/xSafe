/* eslint-disable no-nested-ternary */
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { useGetAccountInfo, useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addContractToMultisigContractsList } from 'src/apiCalls/multisigContractsCalls';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks/transactions';
import { CenteredBox, Text } from 'src/components/StyledComponents/StyledComponents';
import { FinalStepActionButton, InputsContainer } from 'src/components/Theme/StyledComponents';
import { deployMultisigContract } from 'src/contracts/ManagerContract';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { useTheme } from 'styled-components';
import { Address } from '@multiversx/sdk-core/out';
import { useMultistepFormContext } from 'src/components/Utils/MultistepForm';
import * as Styled from 'src/components/Utils/styled';
import { useMultisigCreationFormContext } from './DeployMultisigModal';
import MemberPresentationWithPhoto from '../Organization/MemberPresentationWithPhoto';

interface DeployStepsModalType {
    handleClose: () => void;
    setNewContracts: (contracts: MultisigContractInfoType[]) => void;
    enableNextStep?: (enabled: boolean) => ReturnType<React.Dispatch<React.SetStateAction<Record<number, boolean>>>>;
}

const DeployMultisigStepOne = ({
  handleClose,
  setNewContracts,
  enableNextStep = () => null,
}: DeployStepsModalType) => {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();
  const [isLoading, setIsLoading] = useState(false);
  const { proceedToNextStep } = useMultistepFormContext();
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const { pendingDeploymentData: { pendingDeploymentContractData, setPendingDeploymentContractData } } =
  useMultisigCreationFormContext();

  async function onAddMultisigFinished() {
    const { multisigAddress } = pendingDeploymentContractData!;
    const newContracts = await addContractToMultisigContractsList({
      address: multisigAddress,
      name,
    });
    setNewContracts(newContracts);
    proceedToNextStep();
    enableNextStep(true);
    setName('');
  }

  useTrackTransactionStatus({
    transactionId: pendingDeploymentContractData?.transactionId || null,
    onSuccess: onAddMultisigFinished,
    onFail: () => {
      setIsLoading(false);
    },
    onCancelled: () => {
      setIsLoading(false);
    },
    onTimedOut: () => {
      setIsLoading(false);
    },

  });

  const onDeploy = useCallback(async () => {
    try {
      const { multisigAddress, sessionId } = await deployMultisigContract();

      refreshAccount();

      setPendingDeploymentContractData({
        multisigAddress,
        transactionId: sessionId,
      });
    } catch (err) {
      console.error('ERROR:', err);
      setIsLoading(false);
    }
  }, [setPendingDeploymentContractData]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const pendingTransactions = useGetPendingTransactions();

  useEffect(() => {
    setIsLoading(pendingTransactions.hasPendingTransactions);
  }, [pendingTransactions.hasPendingTransactions]);

  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (event: any) => {
    const name = event.target.value;
    if (name.length < 3) {
      setError('Name is too short. It should be at least 3 characters long.');
    } else setError(null);
    setName(name);
  };

  return (
    <Box>
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', right: maxWidth600 ? '10px' : '32px', top: '18px' }}
        size="small"
        aria-label="close"
      >
        <CloseRoundedIcon />
      </IconButton>
      <CenteredBox
        px={maxWidth600 ? 2 : 5}
        textAlign="left"
        borderBottom={`1px solid ${theme.palette.divider.secondary}`}
        justifyContent={'flex-start !important'}
      >
        <Text
          textAlign={'left'}
          py={2}
          fontSize={22}
        >
          {t('Create a new Safe') as string}
        </Text>
        <Text
          textAlign={'left'}
          fontSize={12}
          padding={'3px 0 0 12px'}
          color={`${theme.palette.text.createSafeSteps} !important`}
        >
          {t('Step 1 of 2') as string}
        </Text>
      </CenteredBox>
      <Box px={maxWidth600 ? 2 : 5} py={maxWidth600 ? 2.3 : 3}>
        <Box borderRadius={'10px'}>
          <Text
            width="100%"
            color={'#9C9BA5 !important'}
            textAlign={'left'}
            mb={1}
            fontSize={15}
            fontWeight={600}
          >It's time to create a new Safe!
          </Text>
          <Text
            mt={2}
            color={'#9C9BA5!important'}
          >
            After picking your name and signing the transaction, your brand new Safe will be deployed on the MultiversX blockchain.
          </Text>
          <Box display="flex" flexDirection="column" justifyContent={'space-between'} mt={2}>
            <InputsContainer
              width={'100%'}
              margin="0"
              className={error != null ? 'hasAvailableAmount invalid' : 'hasAvailableAmount'}
            >
              <Styled.TextField
                id="name"
                focused={false}
                value={name}
                autoComplete="off"
                placeholder="Safe Name"
                onChange={handleNameChange}
              />
              <label htmlFor="newQuorumSize">{t('Safe Name') as string}</label>
              <span className="errorMessage">{error}</span>
            </InputsContainer>
          </Box>
          <Box mb={3} display="flex" flexDirection="column">
            <Text display="flex" flex={1} mb={1} alignItems="center">{t('Initial Contract Owner') as string}:</Text>
            <Box flex={3} border={`1px solid ${theme.palette.borders.secondary}`} borderRadius="4px" p={0.85}>
              {address ? (
                <MemberPresentationWithPhoto
                  charactersLeftAfterTruncation={10}
                  memberAddress={new Address(address ?? '')}
                />
              ) : 'Not logged in'}
            </Box>
          </Box>
          <Box display="flex" gap={2} alignItems={'center'}>
            <Box flex={1}>
              <FinalStepActionButton
                disabled={!isLoggedIn || name.length < 3 || isLoading}
                onClick={() => onDeploy()}
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
                >Creating Safe...
                </Box>
                )}
                { !isLoading ? (isLoggedIn ? 'Create my new Safe' : 'Login first') : ''}
              </FinalStepActionButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DeployMultisigStepOne;
