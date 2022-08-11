import { useCountdown } from 'src/utils/useCountdown';
import DateTimeDisplay from './DateTimeDisplay';

const ExpiredNotice = () => (
  <div className="expired-notice">
    <span>Expired!!!</span>
    <p>Please select a future date and time.</p>
  </div>
);

interface ShowCounterProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const ShowCounter = ({ days, hours, minutes, seconds }: ShowCounterProps) => (
  <div className="show-counter">
    <a
      href="https://tapasadhikary.com"
      target="_blank"
      rel="noopener noreferrer"
      className="countdown-link"
    >
      <DateTimeDisplay value={days} type={'d'} />{' '}
      <DateTimeDisplay value={hours} type={'h'} />{' '}
      <DateTimeDisplay value={minutes} type={'m'} />{' '}
      <DateTimeDisplay value={seconds} type={'s'} />
    </a>
  </div>
);

interface CountdownTimerProps {
    targetDate: number;
}
const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  }
  return (
    <ShowCounter
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
};

export default CountdownTimer;
