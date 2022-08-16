interface Props {
    value: number;
    type: string;
}

const DateTimeDisplay = ({ value, type }: Props) => {
  if (value === 0) return <span />;
  return (
    <span>{value}{type}</span>
  );
};

export default DateTimeDisplay;
