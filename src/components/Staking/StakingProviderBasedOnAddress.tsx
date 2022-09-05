import { Box } from '@mui/material';
import { useMemo } from 'react';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { useTheme } from 'styled-components';
import { Text } from '../StyledComponents/StyledComponents';
import APRColumn from './APRColumn';
import ProviderColumn from './ProviderColumn';

interface Props {
    providerAddress: string;

}

const StakingProviderBasedOnAddress = ({ providerAddress }: Props) => {
  const theme: any = useTheme();

  const {
    fetchedProviderIdentities,
  } = useProviderIdentitiesAfterSelection();
  const selectedProvider = useMemo(
    () => fetchedProviderIdentities
      ?.find((provider) => provider.provider === providerAddress),
    [fetchedProviderIdentities],
  );

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      border={`1px solid ${theme.palette.divider.main}`}
      padding={'0 1rem'}
      borderRadius={'10px'}
    >
      <ProviderColumn columnData={selectedProvider?.providerColumn} />
      <Box
        marginLeft={2}
        paddingLeft={2}
        borderLeft={'1px solid #DFDFE8'}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'start'}
      >
        <Text fontWeight={500} marginRight={1}>
          APR:
        </Text>
        <APRColumn columnData={selectedProvider?.aprColumn} />
      </Box>
    </Box>
  );
};

export default StakingProviderBasedOnAddress;
