import { Box, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { useEffect, useState } from 'react';
import useDebounce from 'src/utils/useDebounce';
import ProvidersList from './ProvidersList';
import { StakingSearchBar } from '../Theme/StyledComponents';

interface Props {
    enableNextStep?: (enabled: boolean) => ReturnType<React.Dispatch<React.SetStateAction<Record<number, boolean>>>>;
}

const StakingFormStepOne = ({ enableNextStep = () => null }: Props) => {
  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);

  useEffect(() => {
    enableNextStep(!!selectedStakingProvider);
  }, [selectedStakingProvider, enableNextStep]);

  const [searchParam, setSearchParam] = useState('');
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);

  useEffect(() => {
    const containerOfProvList = document.getElementsByClassName('containerOfProvList')[0];
    const provList = containerOfProvList.children[0];

    const handleScroll = () => {
      if (provList.scrollTop <= 420) setIsScrollToBottom(false);
      else setIsScrollToBottom(true);
    };

    provList.addEventListener('scroll', handleScroll);
  }, []);

  const debouncedSearchParam = useDebounce(searchParam, 500);

  const resultOfSetScroll = isScrollToBottom ? 'scrolledToBottom' : 'notScrolledToBottom';

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
      <Box
        padding="0 3rem"
        className={`containerOfProvList ${resultOfSetScroll}`}
        sx={{
          position: 'relative',
          transition: 'background .4s linear',
          '&.notScrolledToBottom:after': {
            position: 'absolute',
            width: '100%',
            height: '77px',
            content: '""',
            bottom: '0',
            left: '0',
            background: 'linear-gradient(0deg, rgba(255,255,255,0.8930) 30%, rgba(255,252,252,0) 100%)',
          },
          '&.scrolledToBottom:after': {
            display: 'none',
          },
        }}
      >
        <ProvidersList searchParam={debouncedSearchParam} />
      </Box>
    </Box>
  );
};

export default StakingFormStepOne;
