import { useCallback, useMemo, useState } from 'react';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
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
import { ProposalsTypes } from 'src/types/Proposals';

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
        headerName: 'ASSET',
        flex: 1.2,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className="d-flex justify-content-center align-items-center">
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
        headerName: 'BALANCE',
        flex: 1.2,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any>) => (
          <h6 className="text-center mb-0">
            {Number(
              Number(
                operations.denominate({
                  input: params.value.amount,
                  denomination: params.value.decimals,
                  decimals: params.value.decimals,
                  showLastNonZeroDecimal: true,
                }),
              ).toFixed(8),
            )}
            ${params.value.identifier}
          </h6>
        ),
      },
      {
        field: 'value',
        headerName: 'VALUE',
        flex: 1.2,
        renderCell: (params: GridRenderCellParams<any>) => (
          <h5 className="ex-currency text-center mb-0">
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
          </h5>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        width: 150,
        headerName: '',
        getActions: (params: GridRenderCellParams) => [
          <div key="0" className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              // eslint-disable-next-line react/jsx-curly-brace-presence
              icon={CallMadeIcon as any}
              label="Send"
              onClick={() =>
                handleOptionSelected(ProposalsTypes.send_token, params.row)
              }
            />
          </div>,
          <div key="1" className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              // eslint-disable-next-line react/jsx-curly-brace-presence
              icon={CallReceivedIcon as any}
              label="Receive"
              onClick={handleQrModal}
            />
          </div>,
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
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '5px 0 0 20px',
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
