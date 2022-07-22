import { operations } from '@elrondnetwork/dapp-utils';
import {
  DataGrid,
  GridRenderCellParams,
  GridRowSpacingParams,
  GridSelectionModel,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from '@mui/x-data-grid';
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { IAPRColumn, IFilledColumn, IProvider, IProviderColumn, IProviderIdentity } from 'src/types/staking';
import { denomination, decimals } from 'src/config';
import { Box } from '@mui/material';
import pipe from 'src/utils/compose';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import APRColumn from './APRColumn';
import ProviderColumn from './ProviderColumn';
import FilledColumn from './FilledColumn';

interface IdentityWithColumns extends IProviderIdentity {
    id: string;
    providerColumn: IProviderColumn;
    aprColumn: IAPRColumn;
    filledColumn: IFilledColumn;
    numNodes: number;
}

interface Props {
    searchParam?: string;
}

const ProvidersList = ({ searchParam }: Props) => {
  const fetchProviders = (): Promise<IProvider[]> =>
    axios.get('https://api.elrond.com/providers').then((res) => res.data);

  const {
    data: fetchedProviders,
  } = useQuery(
    [QueryKeys.FETCHED_PROVIDERS],
    fetchProviders,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
      refetchOnMount: false,
    },
  );

  const buildColumns = useCallback(
    (data: IProviderIdentity[]): IdentityWithColumns[] => data.map((provider: IProviderIdentity) => {
      const stakedAmount = Number(operations.denominate({
        input: provider.locked,
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
      }).replaceAll(',', ''));

      const providerBeforeIdentityFetch = fetchedProviders?.find((p) => p.identity === provider.identity);
      const delegationCap = providerBeforeIdentityFetch?.delegationCap;

      const denominatedDelegationCap = operations.denominate({
        input: delegationCap ?? '1',
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
      });

      const delegationCapForCalculations = Number(denominatedDelegationCap.replaceAll(',', ''));

      let filledPercentage = Number(Number((stakedAmount / delegationCapForCalculations) * 100).toFixed(1));
      if (filledPercentage > 100) filledPercentage = 100;

      return {
        ...provider,
        numNodes: providerBeforeIdentityFetch?.numNodes ?? 0,
        id: provider.identity,
        providerColumn: { avatar: provider.avatar, name: provider.name, website: provider.website },
        aprColumn: {
          apr: provider.apr ?? 0,
        },
        filledColumn: {
          filledPercentage,
        },
      };
    }), [fetchedProviders]);

  const sortAfterNodes = useCallback((data: IdentityWithColumns[]) => data.sort((a, b) => b.numNodes - a.numNodes), []);

  const bringValidBlocksFirst = useCallback((data: IdentityWithColumns[]) => {
    const validBlocksIndex = data.findIndex((p) => p.identity === 'validblocks');
    if (validBlocksIndex > -1) {
      const validBlocks = data.splice(validBlocksIndex, 1);
      data.unshift(validBlocks[0]);
    }
    return data;
  }, []);

  const filterBySearchParam = useCallback((data: IProviderIdentity[]) => {
    if (!searchParam) return data;
    return data.filter((p) => p.identity.toLowerCase().includes(searchParam.toLowerCase()));
  }, [searchParam]);

  const fetchProviderIdentities = () => {
    const providerIds = fetchedProviders?.map((provider: IProvider) => provider.identity).join(',');
    return axios.get(`https://api.elrond.com/identities?identities=${providerIds}`).then((res) => res.data);
  };

  const {
    data: fetchedProviderIdentities,
    isFetching: isFetchingProviderIdentities,
    isLoading: isLoadingProviderIdentities,
    isError: isErrorOnFetchingProviderIdentities,
  } = useQuery(
    [QueryKeys.FETCHED_PROVIDER_IDENTITIES],
    fetchProviderIdentities,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
      enabled: !!fetchedProviders,
      refetchOnMount: false,
      select: (data: IProviderIdentity[]) => pipe(
        filterBySearchParam,
        buildColumns,
        sortAfterNodes,
        bringValidBlocksFirst,
      )(data),
    },
  );

  const columns = useMemo(
    () => {
      if (!fetchedProviderIdentities) return [];
      return [
        {
          field: 'providerColumn',
          headerName: 'Provider',
          flex: 2.5,
          renderCell: (params: GridRenderCellParams<IProviderColumn>) => (
            <ProviderColumn columnData={params.value as IProviderColumn} />
          ),
        },
        {
          field: 'aprColumn',
          headerName: 'APR',
          flex: 1,
          renderCell: (params: GridRenderCellParams<IAPRColumn>) => (
            <APRColumn columnData={params.value as IAPRColumn} />
          ),
        },
        {
          field: 'filledColumn',
          headerName: 'Filled',
          flex: 1,
          renderCell: (params: GridRenderCellParams<IFilledColumn>) => (
            <FilledColumn columnData={params.value as IFilledColumn} />
          ),
        },
        {
          ...GRID_CHECKBOX_SELECTION_COL_DEF,
          flex: 0.5,
        },
      ];
    },
    [fetchedProviderIdentities],
  );

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => ({
    top: params.isFirstVisible ? 0 : 6,
    bottom: params.isLastVisible ? 0 : 6,
  }), []);

  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([selectedStakingProvider]);

  const dispatch = useDispatch();

  const onSelectionModelChanged = useCallback((newSelectionModel: GridSelectionModel) => {
    setSelectionModel([newSelectionModel[newSelectionModel.length - 1]]);
    dispatch(setSelectedStakingProvider(newSelectionModel[newSelectionModel.length - 1]));
  }, []);

  if (isFetchingProviderIdentities || isLoadingProviderIdentities) {
    return (
      <Box
        maxHeight={310}
        minHeight={310}
        sx={{ paddingTop: '2rem' }}
      ><LoadingDataIndicator dataName="provider" />
      </Box>
    );
  }

  if (isErrorOnFetchingProviderIdentities) return <ErrorOnFetchIndicator dataName="provider" />;

  return (
    <Box
      maxHeight={310}
      minHeight={310}
      overflow="scroll"
      sx={{ padding: '0 !important' }}
    >
      <DataGrid
        autoHeight
        rowHeight={68}
        rows={fetchedProviderIdentities ?? []}
        columns={columns}
        headerHeight={48}
        checkboxSelection
        getRowSpacing={getRowSpacing}
        onSelectionModelChange={onSelectionModelChanged}
        selectionModel={selectionModel}
        sx={{
          borderRadius: '10px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
          border: 'none',
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '5px 0 0 20px',
          },
          '& .MuiDataGrid-columnHeaderCheckbox': {
            display: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            border: 'none',

          },
          '& .MuiDataGrid-row': {
            borderRadius: '10px',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#F5F7FF',
            '& .MuiButton-root': {
              opacity: '1',
            },
          },
          '& p': {
            margin: 0,
            color: 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiTablePagination-select': {
            paddingTop: 0,
            paddingBottom: 0,
          },
          '& .MuiInputBase-root': {
            margin: '0 8px',
          },
        }}
      />
    </Box>
  );
};

export default ProvidersList;
