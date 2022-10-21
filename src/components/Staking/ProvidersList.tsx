import {
  GridRenderCellParams,
  GridRowSpacingParams,
  GridSelectionModel,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { IAPRColumn, IFilledColumn, IProviderColumn } from 'src/types/staking';
import * as Styled from '../../pages/Organization/styled';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import APRColumn from './APRColumn';
import ProviderColumn from './ProviderColumn';
import FilledColumn from './FilledColumn';

interface Props {
    searchParam?: string;
}

const ProvidersList = ({ searchParam }: Props) => {
  const config = useMemo(() => ({ searchParam }), [searchParam]);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);

  const {
    fetchedProviderIdentities,
    isFetchingProviderIdentities,
    isLoadingProviderIdentities,
    isErrorOnFetchingProviderIdentities,
  } = useProviderIdentitiesAfterSelection(config);

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

  const onSelectionModelChanged = useCallback((newSelectionModel: GridSelectionModel) => {
    const newSelectedProvider = newSelectionModel[newSelectionModel.length - 1];
    setSelectionModel([newSelectedProvider]);
    dispatch(setSelectedStakingProvider(newSelectedProvider));
  }, [dispatch]);

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
      <Styled.MainTable
        autoHeight
        rowHeight={68}
        rows={fetchedProviderIdentities ?? []}
        columns={columns}
        headerHeight={48}
        checkboxSelection
        getRowSpacing={getRowSpacing}
        onSelectionModelChange={onSelectionModelChanged}
        pagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        selectionModel={selectionModel}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        sx={{
          '& .MuiDataGrid-columnHeaderCheckbox': {
            display: 'none',
          },
          '& .MuiDataGrid-cellCheckbox > span.MuiCheckbox-root': {
            p: '0',
            '& svg': {
              width: '32px',
              height: '32px',
              border: 'solid 1px #dfdfe8',
              borderRadius: '50%',
              pt: '0.1rem',
              '& path': {
                fill: 'transparent',
              },
            },
            '& svg[data-testid="CheckBoxIcon"]': {
              backgroundColor: 'white',
              boxShadow: 'inset 0px 0px 1px #4c2ffc, inset 1px 0px 1px #4c2ffc, inset 2px 0px 1px #4c2ffc, inset 3px 0px 1px #4c2ffc, inset 4px 0px 1px #4c2ffc, inset 5px 0px 1px #4c2ffc, inset 0px 1px 1px #4c2ffc, inset 0px 2px 1px #4c2ffc, inset 0px 3px 1px #4c2ffc, inset 0px 4px 1px #4c2ffc, inset 0px 5px 1px #4c2ffc,inset 0px 6px 1px #4c2ffc, inset -1px 0px 1px #4c2ffc, inset -2px 0px 1px #4c2ffc, inset -3px 0px 1px #4c2ffc, inset -4px 0px 1px #4c2ffc, inset -5px 0px 1px #4c2ffc, inset 0px -1px 1px #4c2ffc, inset 0px -2px 1px #4c2ffc, inset 0px -3px 1px #4c2ffc, inset 0px -4px 1px #4c2ffc, inset 0px -5px 1px #4c2ffc',
              '& path': {
                fill: '#4c2ffc',
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default ProvidersList;
