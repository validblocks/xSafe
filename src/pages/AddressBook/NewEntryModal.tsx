import React from 'react';
import { Typography } from '@mui/material';

type NewEntryModalProps = {
  form: Record<string, any>;
};

const NewEntryModal = ({ form }: NewEntryModalProps) => {
  return (
    <>
      <Typography id='modal-modal-title' variant='h6' component='h2'>
        Text in a modal
      </Typography>
      <form onSubmit={form.handleSubmit}>
        <label htmlFor='address'>Address</label>
        <input
          id='address'
          name='address'
          type='text'
          onChange={form.handleChange}
          value={form.values.address}
        />
        <label htmlFor='name'>Name</label>
        <input
          id='name'
          name='name'
          type='text'
          onChange={form.handleChange}
          value={form.values.name}
        />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default NewEntryModal;
