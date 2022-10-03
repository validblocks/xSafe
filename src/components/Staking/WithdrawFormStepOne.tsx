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
            <InputAdornment position="start" sx={{ ml: '2.2rem', mt: '0 !important' }}>
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box
        padding={'0 3rem'}
        sx={{
          position: 'relative',
          '&:after': {
            position: 'absolute',
            width: '470px',
            height: '20px',
            content: '""',
            bottom: '-20px',
            left: '25px',
            transition: 'height .3s linear',
            borderRadius: '12px',
            boxShadow: '0px -10px 30px 25px rgba(255,255,255, .867)',
            background: 'transparent',
          },
        }}
      >
        <ProvidersWithUndelegationDetails searchParam={debouncedSearchParam} />
      </Box>
    </Box>
  );
};

export default WithdrawFormStepOne;
