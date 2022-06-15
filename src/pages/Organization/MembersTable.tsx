import React, { useCallback, useMemo } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import {
  GridRowId,
  GridActionsCellItem,
  DataGrid,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from '@redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import { useOrganizationInfoContext } from './OrganizationInfoContextProvider';

const MembersTable = () => {
  const dispatch = useDispatch();
  const onRemoveUser = (address: Address) =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.remove_user,
        address: address.bech32(),
      }),
    );

  const toggleAdmin = useCallback(
    (id: GridRowId) => () => {
      // setRows((prevRows) =>
      //   prevRows.map((row) =>
      //     row.id === id ? { ...row, isAdmin: !row.isAdmin } : row
      //   )
      // );
    },
    [],
  );

  const duplicateUser = useCallback(
    (id: GridRowId) => () => {
      // setRows((prevRows) => {
      //   const rowToDuplicate = prevRows.find((row) => row.id === id)!;
      //   return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      // });
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        field: 'member',
        headerName: 'Member',
        type: 'string',
        width: 350,
        renderCell: (params: GridRenderCellParams<any>) => (
          <div className="d-flex align-items-center">
            <img
              className="mr-3 rounded w-100 h-100"
              src="https://picsum.photos/30/30?random=1"
            />
            <div>
              <div>
                {`${params.value.valueHex.slice(
                  0,
                  10,
                )}...${params.value.valueHex.slice(
                  params.value.valueHex.length - 10,
                )}`}
                {/* <Ui.Trim text={params.value.valueHex} /> */}
              </div>
              <div>@herotag</div>
            </div>
          </div>
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        type: 'string',
        width: 200,
        renderCell: (params: GridRenderCellParams<any>) => (
          <div
            className="p-2 rounded"
            style={
              params.value === 'Board Member'
                ? { background: 'rgba(255,0,0, 0.1)', color: 'red' }
                : { background: 'rgba(0,255,0, 0.1)', color: 'green' }
            }
          >
            {params.value}
          </div>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        width: 300,
        headerName: 'Quick Actions',
        getActions: (params: any) => [
          // eslint-disable-next-line react/jsx-key
          <div className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              icon={<ToggleOnIcon htmlColor="#9DABBD" />}
              label="Toggle Admin"
              onClick={toggleAdmin(params.id)}
            />
          </div>,
          // eslint-disable-next-line react/jsx-key
          <div className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              icon={<EditIcon htmlColor="#9DABBD" />}
              label="Disable User"
              onClick={duplicateUser(params.id)}
            />
          </div>,
          // eslint-disable-next-line react/jsx-key
          <div className="shadow-sm p-2 rounded mr-2">
            <GridActionsCellItem
              icon={<DeleteIcon htmlColor="#9DABBD" />}
              label="Delete"
              onClick={() => onRemoveUser(params.row.member)}
            />
          </div>,
        ],
      },
    ],
    [onRemoveUser, toggleAdmin, duplicateUser],
  );

  const { allMemberAddresses } = useOrganizationInfoContext();

  return (
    <DataGrid
      autoHeight
      rowHeight={65}
      rows={allMemberAddresses}
      columns={columns}
    />
  );
};

export default MembersTable;
