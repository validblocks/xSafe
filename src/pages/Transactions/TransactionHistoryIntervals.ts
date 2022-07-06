export type HistoryInterval = {
  intervalStartTimestamp: number;
  label: string;
};

interface ITimeShiftable {
  quantities: number[];
  getTimestamp: (quantity: number) => number;
  label: string;
}

export const SECOND_TO_MILLISECOND_SCALAR = 1000;

const dateNow = new Date();

const lastXDays: ITimeShiftable = {
  getTimestamp: (daysFromNow: number): number => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysFromNow);
    return Math.floor(daysAgo.getTime() / SECOND_TO_MILLISECOND_SCALAR);
  },
  quantities: [1, 3],
  label: 'day'
};

const lastXWeeks: ITimeShiftable = {
  getTimestamp: (weeksFromNow: number): number => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - weeksFromNow * 7);
    return Math.floor(weekAgo.getTime() / SECOND_TO_MILLISECOND_SCALAR);
  },
  quantities: [1, 2],
  label: 'week'
};

const lastXMonths: ITimeShiftable = {
  getTimestamp: (monthsFromNow: number): number => {
    const date = new Date(dateNow.getTime());
    date.setMonth(date.getMonth() - monthsFromNow);
    return Math.floor(date.getTime() / SECOND_TO_MILLISECOND_SCALAR);
  },
  quantities: [1, 2, 3, 6],
  label: 'month'
};

const lastXIntervals: ITimeShiftable[] = [lastXDays, lastXWeeks, lastXMonths];

export const HISTORY_INTERVALS = (function createIntervals() {
  const historyIntervals: HistoryInterval[] = [];

  lastXIntervals.forEach((timeShiftable: ITimeShiftable) => {
    timeShiftable.quantities.forEach((quantity: number) => {
      historyIntervals.push({
        intervalStartTimestamp: timeShiftable.getTimestamp(quantity),
        label: `Last ${quantity > 1 ? quantity : ''} ${timeShiftable.label}${
          quantity > 1 ? 's' : ''
        }`
      });
    });
  });

  return historyIntervals;
})();
