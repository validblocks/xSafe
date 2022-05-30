import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { uniqueContractAddress } from 'multisigConfig';
import breadcrumbItems from './BreadcrumbItems';

const PageBreadcrumbs = () => {
  const [breadcrumb, setBreadcrumb] = useState([]);
  //   const [breadcrumbLink, setbreadcrumbLink] = useState('');

  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname, 'location.pathname');
    setBreadcrumb(breadcrumbItems[location.pathname.substring(1)]);

    // setbreadcrumbLink(breadcrumbItems[location.pathname.substring(1)].link);
  }, [location.pathname]);

  return (
    <div role='presentation'>
      <Breadcrumbs separator='›' aria-label='breadcrumb'>
        <Link color='inherit' to={`/multisig/${uniqueContractAddress}`}>
          Home
        </Link>
        {breadcrumb?.map((el: any, index: any) => (
          <Link key={index} color='inherit' to={el.link}>
            {el.name}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default PageBreadcrumbs;
