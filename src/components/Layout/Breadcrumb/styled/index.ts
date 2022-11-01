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
  fontWeight: _.font.weight.lg,
  transition: 'color 256ms ease-in-out',
  '&:hover': {
    color: '#4c2FFC',
    textDecoration: 'none',
  },
}));

export const SecondaryBreadcrumbsLink = styled(MainBreadcrumbsLink)(
  ({ theme: _ }) => ({
    color: _.palette.black.minorlyReducedOpacity,
  }),
);
