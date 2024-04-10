import { Box, Divider, OutlinedInput, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { FormSearchInput } from 'src/components/Theme/StyledComponents';
import SearchIcon from 'src/assets/img/searchFilled.svg';
import { setNavbarSearchParam } from 'src/redux/slices/searchSlice';
import useDebounce from 'src/hooks/useDebounce';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ListGridViewSelection from './ListGridViewSelection';
import { CardDetailsViewSelection } from './CardDetailsViewSelection';
import NftControlledGrid from './NftControlledGrid';

interface NftPageContextType {
  hasNftDetailsEnabled: boolean;
}

const NftPageContext = createContext<NftPageContextType>({
  hasNftDetailsEnabled: true,
} as NftPageContextType);

export const useNftPageContext = () => useContext(NftPageContext);

function NftComponent() {
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const theme = useCustomTheme();
  const dispatch = useDispatch();

  const [searchParam, setSearchParam] = useState('');
  const [isGroupedByCollection, setIsGroupedByCollection] = useState(true);
  const [areNftDetailsEnabled, setAreNftDetailsEnabled] = useState(true);
  const debouncedSearchParam = useDebounce(searchParam, 500);

  const handleSearchInputChange = useCallback(
    (e: any) => setSearchParam(e.target.value),
    [],
  );

  useEffect(() => {
    dispatch(setNavbarSearchParam(debouncedSearchParam));
  }, [dispatch, debouncedSearchParam]);

  return (
    <NftPageContext.Provider
      value={useMemo(
        () => ({
          hasNftDetailsEnabled: areNftDetailsEnabled,
        }),
        [areNftDetailsEnabled],
      )}
    >
      <Box
        padding="0"
        paddingBottom={
          // eslint-disable-next-line no-nested-ternary
          maxWidth600 ? (isGroupedByCollection ? '60px' : '70px') : 0
        }
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderTopRightRadius: '4px',
              borderTopLeftRadius: '4px',
              borderBottomRightRadius: isGroupedByCollection ? '4px' : 0,
              borderBottomLeftRadius: isGroupedByCollection ? '4px' : 0,
              backgroundColor: theme.palette.background?.secondary,
              padding: '0.5rem 1rem',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="form" noValidate autoComplete="off">
                  <FormSearchInput>
                    <img src={SearchIcon} />
                    <OutlinedInput
                      onChange={handleSearchInputChange}
                      placeholder="Search..."
                    />
                  </FormSearchInput>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <ListGridViewSelection
                setIsGroupedByCollection={setIsGroupedByCollection}
              />
              <Divider
                sx={{
                  marginLeft: '0.5rem',
                  background: '#dfdfe821',
                  height: '33px',
                }}
                orientation="vertical"
              />
              <CardDetailsViewSelection
                setAreNftDetailsEnabled={setAreNftDetailsEnabled}
              />
            </Box>
          </Box>
        </Box>
        <Box
          component={motion.div}
          exit={{ opacity: 0 }}
          sx={{
            border: isGroupedByCollection
              ? 'none'
              : '1px solid rgb(30, 29, 42)',
            borderBottomRightRadius: '4px',
            borderBottomLeftRadius: '4px',
            paddingRight: isGroupedByCollection ? 0 : '16px',
            paddingTop: isGroupedByCollection ? '1rem' : 0,
            paddingBottom: isGroupedByCollection ? 0 : '16px',
          }}
        >
          <NftControlledGrid isGroupedByCollection={isGroupedByCollection} />
        </Box>
      </Box>
    </NftPageContext.Provider>
  );
}

export default NftComponent;
