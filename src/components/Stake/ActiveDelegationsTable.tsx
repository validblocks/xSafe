/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useMemo, useState } from 'react';
import {
  DataGrid,
  GridRenderCellParams,
  GridRowSpacingParams,
  GridSelectionModel,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { TokenTableRowItem } from 'src/pages/Organization/types';
import {
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend,
  setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { Box } from '@mui/material';
import { IProviderColumn, IAPRColumn, IFilledColumn } from 'src/types/staking';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import APRColumn from '../Staking/APRColumn';
import FilledColumn from '../Staking/FilledColumn';
import ProviderColumn from '../Staking/ProviderColumn';
import { AssetActionButton } from '../Theme/StyledComponents';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';

interface Props {
    rows: any[];
    isFetching?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    dataName?: string;
}

export const SQUARE_IMAGE_WIDTH = 30;

const ActiveDelegationsTable = ({ rows = [], isError, isFetching, isLoading, dataName = 'data' }: Props) => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);

  console.log({ renderTable: '1' });

  const handleOptionSelected = useCallback((
    option: ProposalsTypes,
    token: TokenTableRowItem,
  ) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(
      setSelectedTokenToSend({
        id: token.id,
        identifier: token.identifier,
        balance: token.balance,
      }),
    );
  }, [dispatch]);

  const getTableActions = useCallback((params: GridRenderCellParams) => [
    <AssetActionButton
      key="0"
      variant="outlined"
      className="shadow-sm rounded mr-2"
      onClick={() =>
        handleOptionSelected(ProposalsTypes.send_token, params.row)
        }
    >
      <AssetActionIcon width="30px" height="30px" /> Restake
    </AssetActionButton>,
    <AssetActionButton
      key="1"
      onClick={() => null}
    >
      <AssetActionIcon width="30px" height="30px" transform="rotate(180)" /> Claim
    </AssetActionButton>,
    <AssetActionButton
      key="1"
      onClick={() => null}
    >
      <AssetActionIcon width="30px" height="30px" transform="rotate(180)" /> Unstake
    </AssetActionButton>,
  ], [handleOptionSelected]);

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
        field: 'filledColumn',
        headerName: 'Delegated',
        flex: 1,
        renderCell: (params: GridRenderCellParams<IFilledColumn>) => (
          <FilledColumn columnData={params.value as IFilledColumn} />
        ),
      },
      {
        field: 'aprColumn',
        headerName: 'Rewards',
        flex: 1,
        renderCell: (params: GridRenderCellParams<IAPRColumn>) => (
          <APRColumn columnData={params.value as IAPRColumn} />
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
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
