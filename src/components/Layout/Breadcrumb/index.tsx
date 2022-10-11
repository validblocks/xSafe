import { useState, useEffect, useCallback } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation, Link } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import { Box, OutlinedInput } from '@mui/material';
import { FormSearchInput } from 'src/components/Theme/StyledComponents';
import { useDispatch } from 'react-redux';
import { setNavbarSearchParam } from 'src/redux/slices/searchSlice';
import useDebounce from 'src/utils/useDebounce';
import breadcrumbItems from './BreadcrumbItems';
import { ReactComponent as SearchIcon } from '../../../assets/img/searchFilled.svg';

function PageBreadcrumbs() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    setBreadcrumb(breadcrumbItems[location.pathname.substring(1)]);
  }, [location.pathname]);

  const [searchParam, setSearchParam] = useState('');
  const debouncedSearchParam = useDebounce(searchParam, 500);

  const handleSearchInputChange = useCallback(
    (e: any) => setSearchParam(e.target.value),
    []);

  useEffect(() => {
    dispatch(setNavbarSearchParam(debouncedSearchParam));
  }, [dispatch, debouncedSearchParam]);

  // eslint-disable-next-line consistent-return
  const displaySearch = (val: any) => {
    if (val === 'NFT') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span>{val}</span>
          <Box component="form" noValidate autoComplete="off">
            <FormSearchInput>
              <SearchIcon />
              <OutlinedInput onChange={handleSearchInputChange} placeholder="Search..." />
            </FormSearchInput>
          </Box>
        </Box>
      );
    }
    return `${val}`;
  };

  return (
    <div role="presentation">
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link color="inherit" to={`/multisig/${uniqueContractAddress}`}>
          Home
        </Link>
        {breadcrumb?.map((el: any) => (
          <Link key={el.link} color="inherit" to={el.link}>
            {displaySearch(el.name)}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}

export default PageBreadcrumbs;
