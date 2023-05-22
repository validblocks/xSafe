import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import { useCustomTheme } from 'src/utils/useCustomTheme';
import breadcrumbItems from './BreadcrumbItems';
import * as Styled from './styled/index';

function PageBreadcrumbs() {
  const theme = useCustomTheme();
  const location = useLocation();
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    setBreadcrumb(breadcrumbItems[location.pathname.substring(1)]);
  }, [location.pathname]);

  // eslint-disable-next-line consistent-return
  const displaySearch = (val: any) => `${val}`;

  return (
    <div role="presentation">
      <Styled.BreadcrumbsElement
        separator="›"
        aria-label="breadcrumb"
        sx={{ color: theme.palette.text.primary }}
      >
        <Styled.MainBreadcrumbsLink to={`/multisig/${uniqueContractAddress}`}>
          Home
        </Styled.MainBreadcrumbsLink>
        {breadcrumb?.map((el: any) => (
          <Styled.SecondaryBreadcrumbsLink key={el.link} to={el.link}>
            {displaySearch(el.name)}
          </Styled.SecondaryBreadcrumbsLink>
        ))}
      </Styled.BreadcrumbsElement>
    </div>
  );
}

export default PageBreadcrumbs;
