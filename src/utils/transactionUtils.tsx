import dayjs from 'dayjs';

export const getDate = (unix_timestamp: number) => {
  const milliseconds = unix_timestamp * 1000;
  return new Date(milliseconds);
};

export const humanizedDurationFromTimestamp = (timestamp: number) =>
  dayjs
    .duration(dayjs(getDate(timestamp)).diff(Date.now()), 'milliseconds')
    .humanize(true);
