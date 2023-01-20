import { Box, InputAdornment, useMediaQuery } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import useDebounce from 'src/utils/useDebounce';
import ProvidersList from './ProvidersList';
import { StakingSearchBar } from '../Theme/StyledComponents';

interface Props {
    enableNextStep?: (enabled: boolean) => ReturnType<React.Dispatch<React.SetStateAction<Record<number, boolean>>>>;
}

const StakingFormStepOne = ({ enableNextStep = () => null }: Props) => {
  const theme: any = useTheme();
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

  const resultOfSetScroll = isScrollToBottom ? 'scrolledToBottom' : '';
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <StakingSearchBar
        placeholder="Search for a provider"
        onChange={(e) => setSearchParam(e.target.value)}
        value={searchParam}
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: '2rem', mt: '0 !important' }}>
              <SearchRoundedIcon sx={{ color: theme.palette.text.primary }} />
            </InputAdornment>
          ),
        }}
      />
      <Box
        padding={maxWidth600 ? 0 : '0 3rem'}
        className={`containerOfProvList ${resultOfSetScroll}`}
        sx={{
          position: 'relative',
          '&:after': {
            position: 'absolute',
            width: '100%',
            height: '38px',
            content: '""',
            bottom: '0',
            left: '0',
            background: `linear-gradient(0deg, ${theme.palette.background.overlay} 0%, rgba(255,252,252,0) 100%)`,
            transition: 'height .3s linear',
          },
          '&.scrolledToBottom:after': {
            height: '0px',
          },
        }}
      >
        <ProvidersList searchParam={debouncedSearchParam} />
      </Box>
    </Box>
  );
};

export default StakingFormStepOne;
