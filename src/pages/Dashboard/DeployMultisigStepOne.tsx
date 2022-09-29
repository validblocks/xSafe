import { transactionServices, useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { Box, IconButton, Input } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addContractToMultisigContractsList } from 'src/apiCalls/multisigContractsCalls';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { FinalStepActionButton } from 'src/components/Theme/StyledComponents';
import { deployMultisigContract } from 'src/contracts/ManagerContract';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { useTheme } from 'styled-components';
import { Address } from '@elrondnetwork/erdjs/out';
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
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const { isLoggedIn } = useGetLoginInfo();
  const theme: any = useTheme();

  const { pendingDeploymentData: { pendingDeploymentContractData, setPendingDeploymentContractData } } =
        useMultisigCreationFormContext();
  const { address } = useGetAccountInfo();

  async function onAddMultisigFinished() {
    const { multisigAddress } = pendingDeploymentContractData!;
    const newContracts = await addContractToMultisigContractsList({
      address: multisigAddress,
      name,
    });
    setNewContracts(newContracts);
    enableNextStep(true);
    setName('');
  }

  transactionServices.useTrackTransactionStatus({
    transactionId: pendingDeploymentContractData?.transactionId || null,
    onSuccess: onAddMultisigFinished,
  });

  async function onDeploy() {
    const { multisigAddress, sessionId } = await deployMultisigContract();
    setPendingDeploymentContractData({
      multisigAddress,
      transactionId: sessionId,
    });
  }
  return (
    <Box>
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', right: '10px', top: '20px' }}
        size="small"
        aria-label="close"
      >
        <CloseRoundedIcon />
      </IconButton>
      <Text pl={5} width="100%" textAlign={'left'} py={2} fontSize={24} borderBottom={'1px solid #eee'}>
        {t('Multisig Deployment') as string}
      </Text>
      <Box px={5}>
        <Box mt={1} border={'1px solid #eee'} borderRadius={'10px'} padding={'1rem'}>
          <Text
            width="100%"
            color={theme.palette.grey['700']}
            textAlign={'left'}
            mb={1}
            fontSize={15}
            fontWeight={600}
          >Deploy a new Multisig Contract
          </Text>

          <Text
            mt={2}
            color={theme.palette.grey['600']}
          >
            This is what will happen: After signing this, a brand new Multisig Smart Contract will be deployed on the blockchain.
          </Text>

          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} my={3}>
            <Text display={'flex'} flex={1} alignItems="center">{t('Contract Name') as string}:</Text>
            <Box flex={2}>
              <Input
                fullWidth
                placeholder="Complete Contract Name"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setName(e.target.value)}
              />
            </Box>
          </Box>
          <Box my={1} display={'flex'} flexDirection={'column'}>
            <Text display={'flex'} flex={1} alignItems="center">{t('Initial Owner') as string}:</Text>
            <Box flex={3} border={'1px solid #eee'} borderRadius={'10px'} p={1}>
              {address ? (
                <MemberPresentationWithPhoto
                  charactersLeftAfterTruncation={10}
                  memberAddress={new Address(address ?? '')}
                />
              ) : 'Not logged in'}
            </Box>
          </Box>
          <Box my={3}>
            <Text display={'flex'} flex={1} alignItems="center">{t('Initial Quorum Size') as string}: 1/1</Text>
          </Box>

          <Box display={'flex'} gap={2} alignItems={'center'}>

            <Box flex={1}>
              <FinalStepActionButton
                disabled={!isLoggedIn || name.length <= 3}
                onClick={() => onDeploy()}
              >
                {isLoggedIn ? 'Sign Deploy' : 'Login first'}
              </FinalStepActionButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DeployMultisigStepOne;
