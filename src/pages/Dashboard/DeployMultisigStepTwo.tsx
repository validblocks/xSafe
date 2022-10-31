import { getAccountProviderType, transactionServices } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CopyButton from 'src/components/CopyButton';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useMultistepFormContext } from 'src/components/Utils/MultistepForm';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
import { gasLimit, network } from 'src/config';
import { buildBlockchainTransaction } from 'src/contracts/transactionUtils';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { useMultisigCreationFormContext } from './DeployMultisigModal';
import * as Styled from '../../components/Utils/styled/index';

interface DeployStepsModalType {
    handleClose: () => void;
}

const DeployMultisigStepTwo = ({
  handleClose,
}: DeployStepsModalType) => {
  const { t } = useTranslation();

  const providerType = getAccountProviderType();
  const { pendingDeploymentData: { pendingDeploymentContractData } } =
    useMultisigCreationFormContext();

  const { setIsFinalStepButtonActive, setBuiltFinalActionHandler } = useMultistepFormContext();

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
      transactionServices.sendTransactions({ transactions: transaction });
      handleClose();
    } catch (error) {
      console.error('An error occurred, please try again');
    }
  }, [handleClose, pendingDeploymentContractData?.multisigAddress, providerType]);

  useEffect(() => {
    setIsFinalStepButtonActive(true);
    setBuiltFinalActionHandler(() => () => { onSignChangeContractOwner(); });
  }, [onSignChangeContractOwner, setBuiltFinalActionHandler, setIsFinalStepButtonActive]);

  return (
    <div className="card">
      <Box px={5} pt={5}>
        <p className="h3 text-center" data-testid="delegateTitle">
          {t('Multisig Deployment') as string}
        </p>
        <Box pt={3}>
          <Text fontSize={21} fontWeight={500}>Congratulations! </Text>
          <Text fontSize={18} fontWeight={500} my={2}> A new Multisig contract has been deployed!</Text>
          <Text> The new contract address:</Text>
          <Box display={'flex'} my={2} border={'1px solid #eee'} p={1} borderRadius={'10px'}>
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
          <Text>The only thing left is to change the owner of this Multisig Contract. It's safer this way.</Text>

        </Box>

      </Box>
    </div>
  );
};

export default DeployMultisigStepTwo;
