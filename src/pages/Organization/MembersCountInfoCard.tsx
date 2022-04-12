import React from 'react';

type Props = {
  icon: any;
  memberTypeTitle: string;
  memberCount: string;
};

const MembersCountInfoCard = ({
  icon,
  memberTypeTitle,
  memberCount
}: Props) => {
  return (
    <>
      <div className='d-flex align-items-center justify-content-between'>
        {icon}
        <span className='ml-4'>{memberTypeTitle}</span>
      </div>
      <div className='members-content__item-count-container d-flex align-items-center justify-content-center p-3 w-10 bg-light rounded '>
        <span className='d-flex align-items-center'>{memberCount}</span>
      </div>
    </>
  );
};

export default MembersCountInfoCard;
