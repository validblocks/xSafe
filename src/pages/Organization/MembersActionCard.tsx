import React from 'react';
import { Card, IconButton } from '@mui/material';

type Props = {
  title: string;
  description: string;
  buttonBackground: string;
  icon: React.ReactNode;
  onClickHandler: any;
};

const MembersActionCard = ({
  icon,
  title,
  description,
  buttonBackground,
  onClickHandler
}: Props) => {
  return (
    <Card className='h-100 shadow d-flex'>
      <div className='px-5 d-flex flex-column justify-content-center col-10 py-5 py-lg-0'>
        <h5>
          <strong>{title}</strong>
        </h5>
        <p className='mb-0 text-secondary'>{description}</p>
      </div>
      <div
        className='d-flex justify-content-center align-items-center col-2 w-100 py-5 py-lg-0'
        style={{ backgroundColor: buttonBackground }}
      >
        <IconButton onClick={onClickHandler} color='error'>
          {icon}
        </IconButton>
      </div>
    </Card>
  );
};

export default MembersActionCard;
