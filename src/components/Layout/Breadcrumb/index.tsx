import { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation, Link } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import breadcrumbItems from './BreadcrumbItems';

function PageBreadcrumbs() {
  const [breadcrumb, setBreadcrumb] = useState([]);

  const location = useLocation();
  useEffect(() => {
    setBreadcrumb(breadcrumbItems[location.pathname.substring(1)]);
  }, [location.pathname]);

  return (
    <div role="presentation">
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link color="inherit" to={`/multisig/${uniqueContractAddress}`}>
          Home
        </Link>
        {breadcrumb?.map((el: any) => (
          <Link key={el.link} color="inherit" to={el.link}>
            {el.name}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}

export default PageBreadcrumbs;
