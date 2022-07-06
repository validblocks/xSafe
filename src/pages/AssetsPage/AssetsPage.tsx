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
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
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
  const organizationTokens = useSelector(organizationTokensSelector);

  const columns = useMemo(
    () => [
      {
        field: 'presentation',
        headerName: 'ASSET',
        width: 150,
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
        width: 200,
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
        width: 250,
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
        width: 300,
        headerName: 'Quick Actions',
        getActions: (params: GridRenderCellParams) => [
          <div key="0" className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              icon={<CallMadeIcon htmlColor="#9DABBD" />}
              label="Send"
              onClick={() =>
                handleOptionSelected(ProposalsTypes.send_token, params.row)
              }
            />
          </div>,
          <div key="1" className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              icon={<CallReceivedIcon htmlColor="#9DABBD" />}
              label="Receive"
              onClick={handleQrModal}
            />
          </div>
        ]
      }
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
        rows={organizationTokens ?? []}
        columns={columns}
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
