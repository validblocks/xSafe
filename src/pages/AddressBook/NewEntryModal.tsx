import React from 'react';
import { Typography } from '@mui/material';

type NewEntryModalProps = {
  form: Record<string, any>;
  selectedAddress: string | null;
  addressBook: Record<string, string>;
};

const NewEntryModal = ({
  form,
  selectedAddress,
  addressBook
}: NewEntryModalProps) => {
  return (
    <>
      <Typography id='modal-modal-title' variant='h6' component='h2'>
        {!!selectedAddress ? 'Edit Entry' : 'Create Entry'}
      </Typography>
      <form onSubmit={form.handleSubmit}>
        <label htmlFor='address'>Address</label>
        <input
          id='address'
          name='address'
          type='text'
          onChange={form.handleChange}
          readOnly={!!selectedAddress}
          value={form.values.address}
          placeholder={!!selectedAddress ? selectedAddress : 'Enter address'}
        />
        <label htmlFor='name'>Name</label>
        <input
          id='name'
          name='name'
          type='text'
          onChange={form.handleChange}
          placeholder={
            !!selectedAddress && addressBook[selectedAddress]
              ? addressBook[selectedAddress]
              : 'Enter name'
          }
          value={form.values.name}
        />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default NewEntryModal;
