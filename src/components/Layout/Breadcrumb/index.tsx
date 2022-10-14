import { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation, Link } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import { Box, OutlinedInput } from '@mui/material';
import { useTheme } from 'styled-components';
import { FormSearchInput } from 'src/components/Theme/StyledComponents';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import breadcrumbItems from './BreadcrumbItems';

function PageBreadcrumbs() {
  const theme: any = useTheme();
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
            <FormSearchInput>
              <SearchRoundedIcon />
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
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ color: theme.palette.text.primary }}>
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
