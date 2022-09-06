import { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation, Link } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import { Box, FormControl, OutlinedInput } from '@mui/material';
import breadcrumbItems from './BreadcrumbItems';
import { ReactComponent as SearchIcon } from '../../../assets/img/searchFilled.svg';

function PageBreadcrumbs() {
  const [breadcrumb, setBreadcrumb] = useState([]);

  const location = useLocation();
  useEffect(() => {
    setBreadcrumb(breadcrumbItems[location.pathname.substring(1)]);
  }, [location.pathname]);

  // eslint-disable-next-line consistent-return
  const displaySearch = (val: any) => {
    if (val === 'NFT') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span>{val}</span>
          <Box component="form" noValidate autoComplete="off">
            <FormControl sx={{
              width: '23ch',
              ml: '.93rem',
              p: '.12rem .5rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: '.3rem',
              backgroundColor: 'rgba(76, 47, 252, 0.06)',
              '& input': {
                p: '.25rem',
                fontSize: '14px',
              },
              '& fieldset': {
                border: 'none',
              },
            }}
            >
              <SearchIcon />
              <OutlinedInput placeholder="Search..." />
            </FormControl>
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
