import React, { useEffect, useMemo, useState } from 'react';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const ProposeSendNft = ({ handleChange, setSubmitDisabled }: any) => {
  return (
    <div>
      <div className='modal-control-container mb-4'></div>
      <div className='modal-control-container mb-4'>
        <InputLabel id='demo-simple-select-label'>Identifier</InputLabel>
      </div>

      <div className='modal-control-container'>
        <div className='input-wrapper'></div>
      </div>
    </div>
  );
};

export default ProposeSendNft;
