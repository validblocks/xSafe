import { Box, CircularProgress } from '@mui/material';
import { useCallback } from 'react';
import { CenteredBox, Text } from 'src/components/StyledComponents/StyledComponents';
import { Address } from '@multiversx/sdk-core/out';
import { buildBlockchainTransaction } from 'src/contracts/transactionUtils';
import { gasLimit, network } from 'src/config';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { useGetAccountInfo, useGetAccountProvider } from '@multiversx/sdk-dapp/hooks';
import { setCurrentMultisigTransactionId } from 'src/redux/slices/multisigContractsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import CopyButton from 'src/components/CopyButton';
import { CopyIconLink } from 'src/components/Utils/styled';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import SearchIcon from '@mui/icons-material/Search';
import { FinalStepActionButton } from 'src/components/Theme/StyledComponents';
import { useContractData } from 'src/utils/useContractData';
import { useFullRowAddressCut } from 'src/utils/useFullRowAddressCut';

const ChangeOwnerModalContent = () => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const address = currentContract?.address;

  const { address: walletAddress } = useGetAccountInfo();
  const { providerType } = useGetAccountProvider();
  const onSignChangeContractOwner = useCallback(async () => {
    try {
      const contractAddress = new Address(address);
      const data = `ChangeOwnerAddress@${contractAddress.hex()}`;

      const transaction = await buildBlockchainTransaction(
        0,
        providerType,
        address,
        data,
        gasLimit,
      );

      const { sessionId } = await sendTransactions({ transactions: [transaction] });
      dispatch(setCurrentMultisigTransactionId(sessionId));

      return sessionId;
    } catch (error) {
      console.error('An error occurred, please try again', error);
    }

    return null;
  }, [address, dispatch, providerType]);

  const { charsLeft } = useFullRowAddressCut();

  const {
    isLoading,
    contractData,
  } = useContractData();

  if (isLoading) {
    return (

      <CenteredBox
        sx={{
          justifyContent: 'center !important',
          minHeight: '280px',
          width: '100%',
        }}
      >
        <CircularProgress sx={{
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
        <Text> Safe address:</Text>
        <Box display={'flex'} my={1} border={'1px solid #eee'} p={1} borderRadius={'10px'}>
          <Text>
            {truncateInTheMiddle(address, charsLeft)}
          </Text>
          <Box sx={{ mr: 1.35, ml: 1.35 }}>
            <CopyButton text={address} link={CopyIconLink} />
          </Box>
          <Box>
            <Anchor
              href={`${network.explorerAddress}/accounts/${address}`}
              target="_blank"
              rel="noreferrer"
              color="#6c757d"
            >
              <SearchIcon sx={{ color: '#6C757D !important' }} />
            </Anchor>
          </Box>
        </Box>
        <Box marginTop="21px">
          <Text> Safe owner address:</Text>
          <Box display={'flex'} my={1} border={'1px solid #eee'} p={1} borderRadius={'10px'}>
            <Text>
              {truncateInTheMiddle(walletAddress, charsLeft)}
            </Text>
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
      </Box>
      <Box pt="14px" pb="21px">
        <Text sx={{ opacity: 0.5 }}>
          This step is very important, as it allows the safe to handle all future upgrades through proposals.
        </Text>
      </Box>
      <Box>
        <FinalStepActionButton
          disabled={contractData?.ownerAddress !== walletAddress || isLoading}
          onClick={() => onSignChangeContractOwner()}
        >
          Change owner
        </FinalStepActionButton>
      </Box>
    </Box>
  );
};

export default ChangeOwnerModalContent;
