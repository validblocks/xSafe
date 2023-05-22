/* eslint-disable react/no-unstable-nested-components */
import { memo, useCallback, useMemo, useState } from 'react';
import {
  GridRenderCellParams,
  GridSelectionModel,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProposeMultiselectSelectedOption,
  setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { Box, useMediaQuery } from '@mui/material';
import { IProviderColumn, IDelegatedColumn, IClaimableRewardsColumn } from 'src/types/staking';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import ArrowBackSharp from 'src/assets/img/arrow-back-sharp.svg';
import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import BigNumber from '@multiversx/sdk-core/node_modules/bignumber.js';
import { ProposalsTypes } from 'src/types/Proposals';
import { activeDelegationsRowsSelector } from 'src/redux/selectors/accountSelector';
import ProviderColumn from '../Staking/ProviderColumn';
import { AssetActionButton } from '../Theme/StyledComponents';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import DelegatedColumn from '../Staking/DelegatedColumn';
import ClaimableRewardsColumn from '../Staking/ClaimableRewardsColumn';
import * as Styled from '../../pages/Organization/styled';
import noRowsOverlay from '../Utils/noRowsOverlay';
import DelegationMobileCards from './DelegationMobileCards';

interface Props {
    isFetching?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    dataName?: string;
}

export const SQUARE_IMAGE_WIDTH = 30;

const ActiveDelegationsTable = ({ isError, isFetching, isLoading, dataName = 'data' }: Props) => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const handleOptionSelected = useCallback((
    option: ProposalsTypes,
  ) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
  }, [dispatch]);

  const rows = useSelector(activeDelegationsRowsSelector);

  const getTableActions = useCallback((params: GridRenderCellParams) => [
    <AssetActionButton
      key="0"
      onClick={() => {
        mutateSmartContractCall(
          new Address(params.row.provider),
          new BigUIntValue(new BigNumber(0)),
          'reDelegateRewards');
      }}
    >
      <img src={ArrowBackSharp} width="30px" height="30px" /> Restake
    </AssetActionButton>,
    <AssetActionButton
      key="1"
      onClick={() => {
        mutateSmartContractCall(
          new Address(params.row.provider),
          new BigUIntValue(new BigNumber(0)),
          'claimRewards',
        );
      }}
    >
      <Box
        component="span"
        sx={{ transform: "rotate(180deg)" }}>
        <img src={ArrowBackSharp} width="30px" height="30px"  />
      </Box> Claim
    </AssetActionButton>,
    <AssetActionButton
      key="1"
      onClick={() => {
        handleOptionSelected(ProposalsTypes.unstake_tokens);
        dispatch(setSelectedStakingProvider(params.row));
      }}
    >
      <Box
        component="span"
        sx={{ transform: "rotate(180deg)" }}
      >
        <img src={ArrowBackSharp} width="30px" height="30px"  />
      </Box> Unstake
    </AssetActionButton>,
  ], [dispatch, handleOptionSelected]);

  const columns = useMemo(
    () => [
      {
        field: 'providerColumn',
        headerName: 'Provider',
        sortable: false,
        flex: 1.7,
        renderCell: (params: GridRenderCellParams<IProviderColumn>) => (
          <ProviderColumn withAPR columnData={params.value as IProviderColumn} />
        ),
      },
      {
        field: 'delegatedColumn',
        headerName: 'Delegated',
        flex: 1.2,
        sortable: false,
        renderCell: (params: GridRenderCellParams<IDelegatedColumn>) => (
          <DelegatedColumn columnData={params.value ?? { delegatedAmount: '0' }} />
        ),
      },
      {
        field: 'claimableRewardsColumn',
        headerName: 'Rewards',
        flex: 1.4,
        sortable: false,
        renderCell: (params: GridRenderCellParams<IClaimableRewardsColumn>) => (
          <ClaimableRewardsColumn columnData={params.value as IClaimableRewardsColumn} />
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 2.5,
        width: 210,
        sortable: false,
        headerName: '',
        getActions: (params: GridRenderCellParams) => getTableActions(params),
      },
    ],
    [getTableActions],
  );

  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([selectedStakingProvider]);

  const onSelectionModelChanged = useCallback(() => (newSelectionModel: GridSelectionModel) => {
    const newSelectedProvider = newSelectionModel[newSelectionModel.length - 1];

    setSelectionModel([newSelectedProvider]);
    dispatch(setSelectedStakingProvider(newSelectedProvider));
  }, [dispatch]);

  const onPageSizeChange = useCallback(() => (newPageSize: number) => setPageSize(newPageSize), []);
  const maxWidth600 = useMediaQuery('(max-width: 600px)');

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
      sx={{ padding: maxWidth600 ? '0 0 55px 0' : '0 !important' }}
    >
      {maxWidth600 ? (
        <DelegationMobileCards
          items={rows ?? []}
          actionButton={getTableActions(rows)}
        />
      ) : (
        <Styled.MainTable
          autoHeight
          rowHeight={68}
          rows={rows ?? []}
          disableColumnMenu
          columns={columns}
          headerHeight={48}
          onSelectionModelChange={onSelectionModelChanged}
          pagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          selectionModel={selectionModel}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          components={{ NoRowsOverlay: noRowsOverlay }}
        />
      )}
    </Box>
  );
};

const memoActiveDelegationsTable = memo(ActiveDelegationsTable);

export default memoActiveDelegationsTable;
