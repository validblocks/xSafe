import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import TemplateCard from './TemplateCard';
import { Grid, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { Template } from 'src/types/templates';

export const TemplateMarketplacePanel = () => {
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const api = 'http://localhost:3000';
  const fetchTemplates = (): Promise<Template[]> =>
    axios.get(`${api}/templates`).then((r) => r.data);

  const { data } = useQuery(
    [QueryKeys.CALL_TEMPLATES],
    fetchTemplates,
    USE_QUERY_DEFAULT_CONFIG,
  );

  console.log({ data });
  return (
    <Grid container spacing={2}>
      {data?.map((template, idx) => (
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
