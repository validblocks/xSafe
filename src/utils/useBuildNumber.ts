import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { relatedBranch } from 'src/config';
import { QueryKeys } from 'src/react-query/queryKeys';

export const useBuildNumber = (lettersWanted = 7) => {
  const { data: buildNumberData } = useQuery({
    queryFn: () => axios.get(`https://api.github.com/repos/validblocks/xSafe/commits?sha=${relatedBranch}&per-page=1`, {
      headers: {
        Authorization: `Token ${process.env.REACT_APP_GH_ACCESS_TOKEN}`,
      },
    }).then((r) => r.data),
    enabled: !!process.env.REACT_APP_GH_ACCESS_TOKEN,
    queryKey: QueryKeys.BUILD_NUMBER,
  });

  const buildNumber = useMemo(() =>
    buildNumberData?.[0]?.sha.slice(0, lettersWanted) ?? 'Unknown build',
  [buildNumberData, lettersWanted]);

  return {
    buildNumber,
  };
};
