import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import breadcrumbItems from './BreadcrumbItems';

const PageBreadcrumbs = () => {
  const [breadcrumbName, setbreadcrumbName] = useState('');
  const [breadcrumbLink, setbreadcrumbLink] = useState('');

  const location = useLocation();
  useEffect(() => {
    setbreadcrumbName(breadcrumbItems[location.pathname.substring(1)].name);
    setbreadcrumbLink(breadcrumbItems[location.pathname.substring(1)].link);
  }, []);

  return (
    <div role='presentation'>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link color='inherit' to={'/'}>
          Home
        </Link>
        <Link color='inherit' to={breadcrumbLink}>
          {breadcrumbName}
        </Link>
      </Breadcrumbs>
    </div>
  );
};

export default PageBreadcrumbs;
