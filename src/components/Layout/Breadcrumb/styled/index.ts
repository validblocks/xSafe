import Breadcrumbs from '@mui/material/Breadcrumbs';
import styled from 'styled-components';

export const BreadcrumbsElement = styled(Breadcrumbs)(({ theme: _ }) => ({
  color: 'rgba(0, 0, 0, 0.54)',
  '& .MuiBreadcrumbs-separator': {
    fontSize: '35px',
    maxHeight: '30px',
    alignItems: 'center',
    paddingBottom: '5px',
  },
}));
