import { useCallback, useMemo, useState } from 'react';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import ReceiveModal from 'src/components/ReceiveModal';
import { TokenTableRowItem } from 'src/pages/Organization/types';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  setProposeMultiselectSelectedOption,
  setSelectedTokenToSend,
} from 'src/redux/slices/modalsSlice';
import { ReactComponent as ElrondLogo } from 'src/assets/img/logo.svg';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import { ProposalsTypes } from 'src/types/Proposals';
import { AssetActionButton, AssetValue } from 'src/components/Theme/StyledComponents';

export const SQUARE_IMAGE_WIDTH = 30;

const AssetsPage = () => {
  const dispatch = useDispatch();
  const [showQr, setShowQr] = useState(false);

  const handleQrModal = useCallback(() => {
    setShowQr((showQr: boolean) => !showQr);
  }, []);

  const handleOptionSelected = (
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
  };

  const currentContract = useSelector(currentMultisigContractSelector);
  const tokenTableRows = useSelector(tokenTableRowsSelector);

  const columns = useMemo(
    () => [
      {
        field: 'presentation',
        headerName: 'Asset',
        flex: 1.2,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className="d-flex justify-content-center align-items-center font-weight-normal">
            {params.value.tokenIdentifier !== 'EGLD' && (
              <img
                width={SQUARE_IMAGE_WIDTH}
                height={SQUARE_IMAGE_WIDTH}
                src={params.value.photoUrl}
                alt={params.value.tokenIdentifier}
                className="mr-3"
              />
            )}
            {params.value.tokenIdentifier === 'EGLD' && (
              <ElrondLogo
                width={SQUARE_IMAGE_WIDTH}
                height={SQUARE_IMAGE_WIDTH}
                className="mr-3"
              />
            )}
            <p className="mb-0">
              {params.value.tokenIdentifier.split('-')[0] ?? 'unknown'}
            </p>
          </div>
        ),
      },
      {
        field: 'balanceDetails',
        headerName: 'Balance',
        flex: 1.2,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <h6 className="text-center mb-0 font-weight-normal">
            {Number(
              Number(
                operations.denominate({
                  input: params.value.amount,
                  denomination: params.value.decimals,
                  decimals: params.value.decimals,
                  showLastNonZeroDecimal: true,
                }),
              ).toFixed(8),
            )} ${params.value.identifier}
          </h6>
        ),
      },
      {
        field: 'value',
        headerName: 'Value',
        flex: 0.8,
        renderCell: (params: GridRenderCellParams<any>) => (
          <h5 className="text-center mb-0 font-weight-normal">
            <AssetValue>
              <Ui.UsdValue
                amount={operations.denominate({
                  input: params.value.amount,
                  denomination: params.value.decimals,
                  decimals: params.value.decimals,
                  showLastNonZeroDecimal: true,
                  addCommas: false,
                })}
                usd={params.value.tokenPrice}
              />
            </AssetValue>
          </h5>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        width: 210,
        headerName: '',
        getActions: (params: GridRenderCellParams) => [
          <AssetActionButton
            key="0"
            variant="outlined"
            className="shadow-sm rounded mr-2"
            onClick={() =>
              handleOptionSelected(ProposalsTypes.send_token, params.row)
              }
          >
            <AssetActionIcon width="30px" height="30px" /> Send
          </AssetActionButton>,
          <AssetActionButton
            key="1"
            onClick={handleQrModal}
          >
            <AssetActionIcon width="30px" height="30px" /> Deposit
          </AssetActionButton>,
        ],
      },
    ],
    [],
  );

  return (
    <Box
      sx={{
        width: '100%',
        padding: '2rem',
      }}
    >
      <DataGrid
        autoHeight
        rowHeight={65}
        rows={tokenTableRows ?? []}
        columns={columns}
        sx={{
          borderRadius: '10px',
          boxShadow: '0px 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03)',
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
      <ReceiveModal
        showQrFromSidebar={showQr}
        address={currentContract?.address}
        handleQr={handleQrModal}
      />
    </Box>
  );
};

export default AssetsPage;
