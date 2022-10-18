import { Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import styled from 'styled-components';

export const BreadcrumbsElement = styled(Breadcrumbs)(({ theme: _ }) => ({
  color: _.palette.black.mediumReducedOpacity,
  '& .MuiBreadcrumbs-separator': {
    fontSize: '35px',
    maxHeight: '30px',
    alignItems: 'center',
    paddingBottom: '5px',
  },
}));

export const MainBreadcrumbsLink = styled(Link)(({ theme: _ }) => ({
  color: _.palette.black.reducedOpacity,
}));

export const SecondaryBreadcrumbsLink = styled(Link)(({ theme: _ }) => ({
  color: _.palette.black.minorlyReducedOpacity,
}));
