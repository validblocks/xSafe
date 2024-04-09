import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { relatedBranch, xSafeApiUrl } from 'src/config';
import { QueryKeys } from 'src/react-query/queryKeys';

export const useBuildNumber = () => {
  const { data: buildNumberData } = useQuery({
    queryFn: () =>
      axios
        .get(`${xSafeApiUrl}/contract-build?branch=${relatedBranch}`)
        .then((r) => r.data.data),
    queryKey: QueryKeys.BUILD_NUMBER,
  });

  const buildNumber = useMemo(
    () => buildNumberData ?? 'Unknown',
    [buildNumberData],
  );

  return {
    buildNumber,
  };
};
