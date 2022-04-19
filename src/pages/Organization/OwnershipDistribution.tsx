import React from 'react';
import MultiColorProgressBar from './MultiColorProgressBar';

const OwnershipDistribution = () => {
  const readings = [
    {
      name: 'Apples',
      value: 60,
      color: '#eb4d4b'
    },
    {
      name: 'Blueberries',
      value: 7,
      color: '#22a6b3'
    },
    {
      name: 'Guavas',
      value: 23,
      color: '#6ab04c'
    },
    {
      name: 'Grapes',
      value: 10,
      color: '#e056fd'
    }
  ];
  return (
    <div>
      <h4 className='mb-4'>
        <strong>Ownership Distribution</strong>
      </h4>
      <MultiColorProgressBar readings={readings} />
    </div>
  );
};

export default OwnershipDistribution;
