import React from 'react';
import { Card, IconButton } from '@mui/material';

type Props = {
  title: string;
  description: string;
  buttonBackground: string;
  icon: React.ReactNode;
  onClickHandler: any;
  hoverColor?: string;
};

const MembersActionCard = ({
  icon,
  title,
  description,
  buttonBackground,
  onClickHandler,
  hoverColor,
}: Props) => (
  <Card
    sx={[
      {
        '&:hover .card__right': {
          transition: 'all 0.2s',
          color: '#fff !important',
          backgroundColor: hoverColor,
          border: `2px solid ${hoverColor ?? 'inherit'}`,
        },
      },
      {
        '.card__right': {
          border: '2px solid transparent',
        },
      },
      {
        '&:hover .card__right svg': {
          transition: 'all 0.2s',
          color: hoverColor ? '#fff !important' : '',
        },
      },
      {
        '&:hover .card__left': {
          transition: 'all 0.2s',
          border: `2px solid ${hoverColor}`,
          borderTopLeftRadius: '5px',
          borderBottomLeftRadius: '5px',
        },
      },
      {
        '&:hover .card__left h5': {
          transition: 'all 0.2s',
          color: hoverColor ? `${hoverColor}` : '',
        },
      },
      {
        '.card__left': {
          border: '2px solid transparent',
        },
      },
    ]}
    className="h-100 shadow d-flex"
  >
    <div className="px-4 px-md-5 d-flex flex-column justify-content-center col-10 py-4 py-lg-0 card__left">
      <h5>
        <strong>{title}</strong>
      </h5>
      <p className="mb-0 text-secondary">{description}</p>
    </div>
    <div
      className="d-flex justify-content-center align-items-center col-2 w-100 py-5 py-lg-0 card__right"
      style={{ backgroundColor: buttonBackground }}
    >
      <IconButton onClick={onClickHandler} color="error">
        {icon}
      </IconButton>
    </div>
  </Card>
);

export default MembersActionCard;
