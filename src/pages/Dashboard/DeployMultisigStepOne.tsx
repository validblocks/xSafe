/* eslint-disable no-nested-ternary */
import { refreshAccount, transactionServices, useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { Box, IconButton, Input } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addContractToMultisigContractsList } from 'src/apiCalls/multisigContractsCalls';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CenteredBox, Text } from 'src/components/StyledComponents/StyledComponents';
import { FinalStepActionButton } from 'src/components/Theme/StyledComponents';
import { deployMultisigContract } from 'src/contracts/ManagerContract';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { useTheme } from 'styled-components';
import { Address } from '@elrondnetwork/erdjs/out';
import { useMultistepFormContext } from 'src/components/Utils/MultistepForm';
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

  transactionServices.useTrackTransactionStatus({
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

  const pendingTransactions = transactionServices.useGetPendingTransactions();

  useEffect(() => {
    setIsLoading(pendingTransactions.hasPendingTransactions);
  }, [pendingTransactions.hasPendingTransactions]);

  return (
    <Box>
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', right: '32px', top: '20px' }}
        size="small"
        aria-label="close"
      >
        <CloseRoundedIcon />
      </IconButton>
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
          {t('Step 1 of 2') as string}
        </Text>
      </CenteredBox>
      <Box px={5} py={3}>
        <Box borderRadius={'10px'}>
          <Text
            width="100%"
            color={theme.palette.grey['700']}
            textAlign={'left'}
            mb={1}
            fontSize={15}
            fontWeight={600}
          >It's time to create a new Safe!
          </Text>
          <Text
            mt={2}
            color={theme.palette.grey['600']}
          >
            After picking your name and signing the transaction, your brand new Safe will be deployed on the Elrond blockchain.
          </Text>
          <Box display="flex" flexDirection="column" justifyContent={'space-between'} my={3}>
            <Text display="flex" flex={1} mb={1} alignItems="center">{t('Name of the new Safe') as string}:</Text>
            <Box flex={2}>
              <Input
                fullWidth
                placeholder="Complete Safe Name"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setName(e.target.value)}
                sx={{ color: theme.palette.text.primary }}
              />
            </Box>
          </Box>
          <Box my={1} display="flex" flexDirection="column">
            <Text display="flex" flex={1} mb={1} alignItems="center">{t('Initial Contract Owner') as string}:</Text>
            <Box flex={3} border={`1px solid ${theme.palette.borders.secondary}`} borderRadius={'10px'} p={1}>
              {address ? (
                <MemberPresentationWithPhoto
                  charactersLeftAfterTruncation={10}
                  memberAddress={new Address(address ?? '')}
                />
              ) : 'Not logged in'}
            </Box>
          </Box>
          <Box my={3}>
            <Text display="flex" flex={1} alignItems="center">{t('Initial Quorum Size') as string}: 1/1</Text>
          </Box>
          <Box display="flex" gap={2} alignItems={'center'}>
            <Box flex={1}>
              <FinalStepActionButton
                disabled={!isLoggedIn || name.length <= 3 || isLoading}
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
