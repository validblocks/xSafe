import { Box, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { useEffect, useState } from 'react';
import useDebounce from 'src/utils/useDebounce';
import ProvidersWithUndelegationDetails from './ProvidersWithUndelegationDetails';
import { StakingSearchBar } from '../Theme/StyledComponents';

interface Props {
    enableNextStep?: (enabled: boolean) => ReturnType<React.Dispatch<React.SetStateAction<Record<number, boolean>>>>;
}

const WithdrawFormStepOne = ({ enableNextStep = () => null }: Props) => {
  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);

  useEffect(() => {
    enableNextStep(!!selectedStakingProvider);
  }, [selectedStakingProvider, enableNextStep]);

  const [searchParam, setSearchParam] = useState('');

  const debouncedSearchParam = useDebounce(searchParam, 500);
  return (
    <Box>
      <StakingSearchBar
        placeholder="Search for a provider"
        onChange={(e) => setSearchParam(e.target.value)}
        value={searchParam}
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: '3rem', mt: '0 !important' }}>
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box padding="0 3rem">
        <ProvidersWithUndelegationDetails searchParam={debouncedSearchParam} />
      </Box>
    </Box>
  );
};

export default WithdrawFormStepOne;
