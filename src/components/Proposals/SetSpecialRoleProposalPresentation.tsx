import { Box } from '@mui/system';
import React from 'react';
import { PropertyKeyBox } from '../Utils/PropertKeyBox';
import { PropertyValueBox } from '../Utils/PropertyValueBox';

type Props = {
  parsedArgs: {
    address: string;
    roles: string[];
    tokenIdentifier: string;
  }
};

const SetSpecialRoleProposalPresentation = ({ parsedArgs: {
  address,
  roles,
  tokenIdentifier,
} }: Props) => (
  <Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Address'} />
      <PropertyValueBox value={address} />
    </Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Roles'} />
      <PropertyValueBox value={roles.join(', ')} />
    </Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Token Identifer'} />
      <PropertyValueBox value={tokenIdentifier} />
    </Box>
  </Box>
);

export default SetSpecialRoleProposalPresentation;
