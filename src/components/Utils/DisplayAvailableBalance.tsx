import { Text } from 'src/components/StyledComponents/StyledComponents';

interface IDisplayAvailableBalanceProps {
  availableBalance: number;
  prettyIdentifier: string;
}

const DisplayAvailableBalance = ({
  availableBalance,
  prettyIdentifier,
}: IDisplayAvailableBalanceProps) => {
  if (availableBalance === null || availableBalance === undefined)
    return (
      <Text
        fontSize={13}
        variant="subtitle2"
        className="availableAmount"
        data-testid="dab-text"
      >
        {`Can not display balance`}
      </Text>
    );

  return (
    <Text
      fontSize={13}
      variant="subtitle2"
      className="availableAmount"
      data-testid="dab-text"
    >
      {`Available: ${availableBalance} ${prettyIdentifier}`}
    </Text>
  );
};

export default DisplayAvailableBalance;
