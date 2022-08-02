import { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation, Link } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import { Box, OutlinedInput } from '@mui/material';
import searchedNfts from 'src/components/NftComponent/SearchedNfts';
import { FormSearchInput } from 'src/components/Theme/StyledComponents';
import breadcrumbItems from './BreadcrumbItems';
import { ReactComponent as SearchIcon } from '../../../assets/img/searchFilled.svg';

function PageBreadcrumbs() {
  const [breadcrumb, setBreadcrumb] = useState([]);

  const location = useLocation();
  useEffect(() => {
    setBreadcrumb(breadcrumbItems[location.pathname.substring(1)]);
  }, [location.pathname]);

  // eslint-disable-next-line consistent-return
  const handleSearch = (text: any) => {
    console.log('AICI', searchedNfts(text));
    if (text !== 'mama mea') return searchedNfts(text);
  };

  // eslint-disable-next-line consistent-return
  const displaySearch = (val: any) => {
    if (val === 'NFT') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span>{val}</span>
          <Box component="form" noValidate autoComplete="off">
            <FormSearchInput onChange={() => handleSearch('ceau')}>
              <SearchIcon />
              <OutlinedInput placeholder="Search..." />
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
