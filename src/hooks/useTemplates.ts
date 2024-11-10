import { useGetLoginInfo } from 'src/hooks/sdkDappHooks';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { SafeApi } from 'src/services/xSafeApiProvider';
import { Template } from 'src/types/templates';

interface UseTemplatesParams {
  type?: 'personal' | 'organization' | 'public';
  receiver?: string;
  ownerAddress?: string;
}

export const useTemplates = ({
  type,
  receiver,
  ownerAddress,
}: UseTemplatesParams) => {
  const loginInfo = useGetLoginInfo();

  const fetchTemplates = (): Promise<Template[]> =>
    SafeApi.getAllTemplates(loginInfo.tokenLogin?.nativeAuthToken ?? '', {
      type,
      receiver,
      ownerAddress,
    });

  const queryTemplatesResult = useQuery(
    [QueryKeys.TEMPLATES, type, receiver, ownerAddress],
    fetchTemplates,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      enabled: !!loginInfo.tokenLogin?.nativeAuthToken,
    },
  );

  return useMemo(() => queryTemplatesResult, [queryTemplatesResult]);
};
