import React from 'react';
import './styles/progressbar.scss';

const MultiColorProgressBar = (props: any) => {
  const parent = props;

  const values = parent.readings?.map((item: any, i: number) => {
    if (item.value > 0) {
      return (
        <div
          className='value'
          style={{ color: item.color, width: item.value + '%' }}
          key={i}
        >
          <span>{item.value}%</span>
        </div>
      );
    }
  }, this);

  const calibrations = parent.readings?.map((item: any, i: number) => {
    if (item.value > 0) {
      return (
        <div
          className='graduation'
          style={{ color: item.color, width: item.value + '%' }}
          key={i}
        >
          <span>|</span>
        </div>
      );
    }
  }, this);

  const bars = parent.readings?.map((item: any, i: number) => {
    if (item.value > 0) {
      return (
        <div
          className='bar'
          style={{ backgroundColor: item.color, width: item.value + '%' }}
          key={i}
        ></div>
      );
    }
  }, this);

  const legends = parent.readings?.map((item: any, i: number) => {
    if (item.value > 0) {
      return (
        <div
          className='legend d-flex align-items-center justify-content-between w-100'
          key={i}
        >
          <div className='d-flex'>
            <div className='dot mr-2' style={{ color: item.color }}>
              ●
            </div>
            <div className='label d-flex align-items-center mr-2'>
              {item.name}
            </div>
          </div>
          <div className='percent'>{item.value}%</div>
        </div>
      );
    }
  }, this);

  return (
    <>
      <div className='multicolor-bar d-flex flex-column'>
        {/* <div className='values'>{values == '' ? '' : values}</div> */}
        <div className='bars mb-4'>{bars == '' ? '' : bars}</div>
        <div className='legends w-100'>{legends == '' ? '' : legends}</div>
      </div>
    </>
  );
};

export default MultiColorProgressBar;
