import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { xSafeApiUrl } from 'src/config';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { Template } from 'src/types/templates';

export const useTemplates = () => {
  const fetchTemplates = (): Promise<Template[]> =>
    axios.get(`${xSafeApiUrl}/templates`).then((r) => r.data);

  const { data } = useQuery(
    [QueryKeys.CALL_TEMPLATES],
    fetchTemplates,
    USE_QUERY_DEFAULT_CONFIG,
  );

  return useMemo(() => ({ templates: data }), [data]);
};
