/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useMemo, useState } from 'react';
import {
  DataGrid,
  GridRenderCellParams,
  GridRowSpacingParams,
  GridSelectionModel,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { Box } from '@mui/material';
import { IProviderColumn, IDelegatedColumn, IClaimableRewardsColumn, IdentityWithColumns } from 'src/types/staking';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import ProviderColumn from '../Staking/ProviderColumn';
import { AssetActionButton } from '../Theme/StyledComponents';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import DelegatedColumn from '../Staking/DelegatedColumn';
import ClaimableRewardsColumn from '../Staking/ClaimableRewardsColumn';

interface Props {
    rows: IdentityWithColumns[];
    isFetching?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    dataName?: string;
}

export const SQUARE_IMAGE_WIDTH = 30;

const ActiveDelegationsTable = ({ rows = [], isError, isFetching, isLoading, dataName = 'data' }: Props) => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);

  console.log({ rows });

  const getTableActions = useCallback((params: GridRenderCellParams) => [
    <AssetActionButton
      key="0"
      variant="outlined"
      className="shadow-sm rounded mr-2"
      onClick={() => {
        console.log(params);
        // mutateSmartContractCall(addressParam, '0', 'redelegate');
      }}
    >
      <AssetActionIcon width="30px" height="30px" /> Restake
    </AssetActionButton>,
    <AssetActionButton
      key="1"
      onClick={() => {
        console.log(params);
        // mutateSmartContractCall(addressParam, '0', 'redelegate');
      }}
    >
      <AssetActionIcon width="30px" height="30px" transform="rotate(180)" /> Claim
    </AssetActionButton>,
    <AssetActionButton
      key="1"
      onClick={() => {
        console.log(params);
        // mutateSmartContractCall(addressParam, '0', 'redelegate');
      }}
    >
      <AssetActionIcon width="30px" height="30px" transform="rotate(180)" /> Unstake
    </AssetActionButton>,
  ], []);

  const columns = useMemo(
    () => [
      {
        field: 'providerColumn',
        headerName: 'Provider',
        flex: 1.7,
        renderCell: (params: GridRenderCellParams<IProviderColumn>) => (
          <ProviderColumn withAPR columnData={params.value as IProviderColumn} />
        ),
      },
      {
        field: 'delegatedColumn',
        headerName: 'Delegated',
        flex: 1,
        renderCell: (params: GridRenderCellParams<IDelegatedColumn>) => (
          <DelegatedColumn columnData={params.value ?? { delegatedAmount: '0' }} />
        ),
      },
      {
        field: 'claimableRewardsColumn',
        headerName: 'Rewards',
        flex: 1,
        renderCell: (params: GridRenderCellParams<IClaimableRewardsColumn>) => (
          <ClaimableRewardsColumn columnData={params.value as IClaimableRewardsColumn} />
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 2.5,
        width: 210,
        headerName: '',
        getActions: (params: GridRenderCellParams) => getTableActions(params),
      },
    ],
    [getTableActions],
  );

  const getRowSpacing = useCallback((_params: GridRowSpacingParams) => ({
    // top: params.isFirstVisible ? 0 : 6,
    // bottom: params.isLastVisible ? 0 : 6,
  }), []);

  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([selectedStakingProvider]);

  const onSelectionModelChanged = useCallback((newSelectionModel: GridSelectionModel) => {
    setSelectionModel([newSelectionModel[newSelectionModel.length - 1]]);
    dispatch(setSelectedStakingProvider(newSelectionModel[newSelectionModel.length - 1]));
  }, [dispatch]);

  const onPageSizeChange = useCallback((newPageSize: number) => setPageSize(newPageSize), []);

  if (isLoading || isFetching) {
    return (
      <Box
        maxHeight={310}
        minHeight={310}
        sx={{ paddingTop: '2rem' }}
      ><LoadingDataIndicator dataName={dataName} />
      </Box>
    );
  }

  if (isError) return <ErrorOnFetchIndicator dataName="provider" />;

  return (
    <Box
      sx={{ padding: '0 !important' }}
    >
      <DataGrid
        autoHeight
        rowHeight={68}
        rows={rows}
        columns={columns}
        headerHeight={48}
        getRowSpacing={getRowSpacing}
        onSelectionModelChange={onSelectionModelChanged}
        pagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        selectionModel={selectionModel}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        sx={{
          borderRadius: '10px',
          boxShadow: '0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03)',
          backgroundColor: '#ffff',
          border: 'none',
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '5px 0 0 20px',
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
          '& .MuiTablePagination-actions': {
            marginLeft: '15px',
            '& button svg': {
              color: 'rgba(76, 47, 252, 0.54)',
            },
          },
        }}
      />
    </Box>
  );
};

export default ActiveDelegationsTable;
