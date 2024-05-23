import TemplateCard from './TemplateCard';
import { Grid, useMediaQuery } from '@mui/material';
import { useTemplates } from 'src/hooks/useTemplates';

export const TemplateMarketplacePanel = () => {
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const { templates } = useTemplates();

  return (
    <Grid container spacing={2}>
      {templates?.map((template, idx) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          maxWidth={maxWidth600 ? '100% !important' : '380px !important'}
          key={idx}
        >
          <TemplateCard {...template} />
        </Grid>
      ))}
    </Grid>
  );
};
