import { renderWithProviders } from './utils/renderWithProviders';
import { vi } from 'vitest';
import AmountInputWithTokenSelection, {
  IAmountInputProps,
} from 'src/components/Utils/AmountInputWithTokenSelection';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BigNumber from 'bignumber.js';

const baseProps: IAmountInputProps = {
  onInputChange: vi.fn(),
  onInputBlur: vi.fn(),
  onResetAmount: vi.fn(),
  onAmountIsBiggerThanBalance: vi.fn(),
  onAmountIsLessThanAllowed: vi.fn(),
  onAmountIsNaN: vi.fn(),
  onAmountIsZero: vi.fn(),
  onMaxButtonClick: vi.fn(),
  onAmountChange: vi.fn(),
  config: {
    withAvailableAmount: true,
    withTokenSelection: true,
    isEsdtOrEgldRelated: true,
  },
};

vi.mock('react-redux', async () => ({
  ...(await vi.importActual('react-redux')),
}));

describe('AmountInputWithTokenSelection component', () => {
  it('should render', () => {
    const props = {
      ...baseProps,
    };

    const { container } = renderWithProviders(
      <AmountInputWithTokenSelection {...props} />,
    );

    expect(container).toBeInTheDocument();
  });

  it('should display basic children', () => {
    const props = {
      amount: '10',
      amountError: 'Amount error',
      handleInputChange: vi.fn(),
      handleInputBlur: vi.fn(),
      resetAmount: vi.fn(),
      onAmountChange: vi.fn(),
      config: {
        withAvailableAmount: true,
        withTokenSelection: true,
        isEsdtOrEgldRelated: true,
      },
    };

    const { getByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection {...props} />,
    );

    const amountSelectionBox = getByTestId(
      'aiwts-amount-with-token-selection-box',
    );
    expect(amountSelectionBox).toBeInTheDocument();

    const tokenSelection = getByTestId('aiwts-numeric-format-input');
    expect(tokenSelection).toBeInTheDocument();

    const amountLabel = getByTestId('aiwts-amount-label');
    expect(amountLabel).toBeInTheDocument();

    const maxButton = getByTestId('aiwts-max-button');
    expect(maxButton).toBeInTheDocument();
  });

  const displayAmountTestCases = [
    { amount: 123456789, expectedFormattedAmount: '123,456,789' },
    { amount: 123.456, expectedFormattedAmount: '123.456' },
    { amount: 123456.789, expectedFormattedAmount: '123,456.789' },
    {
      amount: 0.12345678912345678,
      expectedFormattedAmount: '0.12345678912345678',
    },
  ];

  displayAmountTestCases.forEach(({ amount, expectedFormattedAmount }) => {
    it(`should display amount ${amount} as ${expectedFormattedAmount}`, () => {
      const props = {
        ...baseProps,
      };

      const { getByTestId } = renderWithProviders(
        <AmountInputWithTokenSelection {...props} />,
        {
          preloadedState: {
            accountGeneralInfo: {
              ...{
                address: '',
                nonce: 0,
                balance: '',
                rootHash: '',
                txCount: 0,
                username: '',
                shard: 0,
                tokenTableRows: [],
                organizationTokens: [
                  {
                    prettyIdentifier: 'EGLD',
                    identifier: 'EGLD',
                    tokenPrice: 55,
                    balanceLocaleString: Number(amount).toLocaleString(),
                    balance: amount,
                    tokenValue: 5500,
                    photoUrl: 'url',
                    decimals: 18,
                  },
                ],
                multisigBalance: '',
                activeDelegationsRows: [],
                isMultiWalletMode: false,
                isInReadOnlyMode: true,
                totalUsdValue: 0,
              },
            },
          },
        },
      );

      const numericInput = getByTestId('aiwts-numeric-format-input');

      fireEvent.input(numericInput, { target: { value: amount } });

      expect(numericInput).toBeInTheDocument();
      expect(numericInput).toHaveValue(expectedFormattedAmount);
    });
  });

  const availableAmountTestCases = [
    { withAvailableAmount: true, expectedAvailableText: 'Available: 0 EGLD' },
    { withAvailableAmount: false, expectedAvailableText: 'Available: 0 EGLD' },
  ];

  availableAmountTestCases.forEach(
    ({ withAvailableAmount, expectedAvailableText }) => {
      if (withAvailableAmount) {
        it(`should display available amount when withAvailableAmount is true`, () => {
          const props = {
            ...baseProps,
            config: {
              withAvailableAmount,
            },
          };

          const { getByTestId } = renderWithProviders(
            <AmountInputWithTokenSelection {...props} />,
            {
              preloadedState: {
                modals: {
                  proposeModal: {
                    selectedOption: null,
                  },
                  proposeMultiselectModal: {
                    selectedOption: null,
                  },
                  performActionModal: {
                    selectedAction: null,
                    selectedToken: {
                      identifier: 'EGLD',
                    },
                    selectedNft: null,
                    selectedStakingProvider: null,
                    selectedTemplateForSaving: null,
                    selectedTemplateForCreation: null,
                  },
                },
                accountGeneralInfo: {
                  ...{
                    address: '',
                    nonce: 0,
                    balance: '',
                    rootHash: '',
                    txCount: 0,
                    username: '',
                    shard: 0,
                    tokenTableRows: [],
                    organizationTokens: [
                      {
                        prettyIdentifier: 'EGLD',
                        identifier: 'EGLD',
                        tokenPrice: 55,
                        balanceLocaleString: '0',
                        balance: 1,
                        tokenValue: 5500,
                        photoUrl: 'url',
                        decimals: 18,
                      },
                    ],
                    multisigBalance: '',
                    activeDelegationsRows: [],
                    isMultiWalletMode: false,
                    isInReadOnlyMode: true,
                    totalUsdValue: 0,
                  },
                },
              },
            },
          );

          const availableText = getByTestId('dab-text');
          expect(availableText).toBeInTheDocument();
          expect(availableText).toHaveClass('availableAmount');
        });
      } else {
        it(`should not display available amount when withAvailableAmount is false`, () => {
          const props = {
            ...baseProps,
            config: {
              withAvailableAmount: false,
            },
          };

          const { queryByText } = renderWithProviders(
            <AmountInputWithTokenSelection {...props} />,
          );

          const availableText = queryByText(expectedAvailableText);
          expect(availableText).not.toBeInTheDocument();
        });
      }
    },
  );

  it('should render TokenSelection when isEsdtOrEgldRelated is true and withTokenSelection is true', () => {
    const props = {
      ...baseProps,
      config: {
        isEsdtOrEgldRelated: true,
        withTokenSelection: true,
      },
    };

    const { getByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection {...props} />,
    );

    const tokenSelectionComponent = getByTestId('aiwts-token-selection');
    expect(tokenSelectionComponent).toBeInTheDocument();
  });

  it('should not render TokenSelection when isEsdtOrEgldRelated is true and withTokenSelection is false', () => {
    const props = {
      ...baseProps,
      config: {
        isEsdtOrEgldRelated: true,
        withTokenSelection: false,
      },
    };

    const { queryByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection {...props} />,
    );

    const tokenSelectionComponent = queryByTestId('aiwts-token-selection');
    expect(tokenSelectionComponent).not.toBeInTheDocument();
  });

  it('should not render TokenSelection when isEsdtOrEgldRelated is false', () => {
    const props = {
      ...baseProps,
      config: {
        isEsdtOrEgldRelated: false,
      },
    };

    const { queryByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection {...props} />,
    );

    const tokenSelectionComponent = queryByTestId('aiwts-token-selection');
    expect(tokenSelectionComponent).not.toBeInTheDocument();
  });

  it('should render the Max button and call its handler on click', () => {
    const handleMaxButtonClick = vi.fn();

    const { getByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection
        {...baseProps}
        onMaxButtonClick={handleMaxButtonClick}
      />,
    );

    const maxButton = getByTestId('aiwts-max-button');
    expect(maxButton).toBeInTheDocument();

    fireEvent.click(maxButton);
    expect(handleMaxButtonClick).toHaveBeenCalled();
  });

  it('should call handleInputChange when input value changes', () => {
    const handleInputChange = vi.fn();

    const { getByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection
        {...baseProps}
        onInputChange={handleInputChange}
      />,
    );

    const input = getByTestId('aiwts-numeric-format-input');
    fireEvent.change(input, { target: { value: '123' } });

    expect(handleInputChange).toHaveBeenCalled();
  });

  it('should call handleInputBlur when input is blurred', () => {
    const handleInputBlur = vi.fn();

    const { getByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection
        {...baseProps}
        onInputBlur={handleInputBlur}
      />,
    );

    const input = getByTestId('aiwts-numeric-format-input');
    fireEvent.blur(input);

    expect(handleInputBlur).toHaveBeenCalled();
  });

  it('should call maxButtonClickHandler and set amount correctly for an EGLD amount input', () => {
    const handleMaxButtonClick = vi.fn();
    const handleInputChange = vi.fn();
    const handleInputBlur = vi.fn();
    const resetAmount = vi.fn();
    const mockTokenAmount = 100;
    const mockPrettyIdentifier = 'EGLD';
    const expectedAmountAfterMaxClick = '100';

    const { getByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection
        {...baseProps}
        onMaxButtonClick={handleMaxButtonClick}
        onInputChange={handleInputChange}
        onInputBlur={handleInputBlur}
        onResetAmount={resetAmount}
      />,
      {
        preloadedState: {
          accountGeneralInfo: {
            ...{
              address: '',
              nonce: 0,
              balance: '',
              rootHash: '',
              txCount: 0,
              username: '',
              shard: 0,
              tokenTableRows: [],
              organizationTokens: [
                {
                  prettyIdentifier: mockPrettyIdentifier,
                  identifier: mockPrettyIdentifier,
                  tokenPrice: 55,
                  balanceLocaleString: Number(mockTokenAmount).toLocaleString(),
                  balance: mockTokenAmount,
                  tokenValue: 5500,
                  photoUrl: 'url',
                  decimals: 18,
                },
              ],
              multisigBalance: '',
              activeDelegationsRows: [],
              isMultiWalletMode: false,
              isInReadOnlyMode: true,
              totalUsdValue: 0,
            },
          },
        },
      },
    );

    const maxButton = getByTestId('aiwts-max-button');
    fireEvent.click(maxButton);

    expect(handleMaxButtonClick).toHaveBeenCalledTimes(1);

    const numericInput = getByTestId('aiwts-numeric-format-input');
    expect(numericInput).toBeInTheDocument();
    expect(numericInput).toHaveValue(expectedAmountAfterMaxClick);
  });

  it('should call maxButtonClickHandler and set amount correctly with custom max value (SFTs) although it also has EGLD balance', () => {
    const handleMaxButtonClick = vi.fn();
    const handleInputChange = vi.fn();
    const handleInputBlur = vi.fn();
    const resetAmount = vi.fn();
    const mockTokenAmount = 100;
    const mockPrettyIdentifier = 'EGLD';
    const expectedAmountAfterMaxClick = '200';

    const { getByTestId } = renderWithProviders(
      <AmountInputWithTokenSelection
        {...baseProps}
        onMaxButtonClick={handleMaxButtonClick}
        onInputChange={handleInputChange}
        onInputBlur={handleInputBlur}
        onResetAmount={resetAmount}
        maxAmountAllowed={new BigNumber('200')}
        config={{ ...baseProps.config }}
      />,
      {
        preloadedState: {
          accountGeneralInfo: {
            ...{
              address: '',
              nonce: 0,
              balance: '',
              rootHash: '',
              txCount: 0,
              username: '',
              shard: 0,
              tokenTableRows: [],
              organizationTokens: [
                {
                  prettyIdentifier: mockPrettyIdentifier,
                  identifier: mockPrettyIdentifier,
                  tokenPrice: 55,
                  balance: mockTokenAmount,
                  balanceLocaleString: Number(mockTokenAmount).toLocaleString(),
                  tokenValue: 5500,
                  photoUrl: 'url',
                  decimals: 18,
                },
              ],
              multisigBalance: '',
              activeDelegationsRows: [],
              isMultiWalletMode: false,
              isInReadOnlyMode: true,
              totalUsdValue: 0,
            },
          },
        },
      },
    );

    const maxButton = getByTestId('aiwts-max-button');
    fireEvent.click(maxButton);

    expect(handleMaxButtonClick).toHaveBeenCalledTimes(1);

    const numericInput = getByTestId('aiwts-numeric-format-input');
    expect(numericInput).toBeInTheDocument();
    expect(numericInput).toHaveValue(expectedAmountAfterMaxClick);
  });

  const displayBalanceTestCases = [
    {
      amount: 123456789,
      expectedFormattedAmount: '123456789',
      tokenIdentifier: 'EGLD',
    },
    {
      amount: 123.456,
      expectedFormattedAmount: '123.456',
      tokenIdentifier: 'EGLD',
    },
    {
      amount: 123456.789,
      expectedFormattedAmount: '123456.789',
      tokenIdentifier: 'EGLD',
    },
    {
      amount: 0.12345678912345678,
      expectedFormattedAmount: '0.12345678912345678',
      tokenIdentifier: 'EGLD',
    },
    {
      amount: 123456789,
      expectedFormattedAmount: '123456789',
      tokenIdentifier: 'USDC',
    },
    {
      amount: 123.456,
      expectedFormattedAmount: '123.456',
      tokenIdentifier: 'USDC',
    },
    {
      amount: 123456.789,
      expectedFormattedAmount: '123456.789',
      tokenIdentifier: 'USDC',
    },
    {
      amount: 0.123456,
      expectedFormattedAmount: '0.123456',
      tokenIdentifier: 'USDC',
    },
  ];

  displayBalanceTestCases.forEach(
    ({ amount, expectedFormattedAmount, tokenIdentifier }) => {
      it(`should display available balance ${amount} of ${tokenIdentifier} as ${expectedFormattedAmount}`, () => {
        const props = {
          ...baseProps,
        };

        const { getByTestId } = renderWithProviders(
          <AmountInputWithTokenSelection {...props} />,
          {
            preloadedState: {
              modals: {
                proposeModal: {
                  selectedOption: null,
                },
                proposeMultiselectModal: {
                  selectedOption: null,
                },
                performActionModal: {
                  selectedAction: null,
                  selectedToken: {
                    identifier: tokenIdentifier,
                  },
                  selectedNft: null,
                  selectedStakingProvider: null,
                  selectedTemplateForCreation: null,
                  selectedTemplateForSaving: null,
                },
              },
              accountGeneralInfo: {
                ...{
                  address: '',
                  nonce: 0,
                  balance: '',
                  rootHash: '',
                  txCount: 0,
                  username: '',
                  shard: 0,
                  tokenTableRows: [],
                  organizationTokens: [
                    {
                      prettyIdentifier: tokenIdentifier,
                      identifier: tokenIdentifier,
                      tokenPrice: 55,
                      balance: amount,
                      balanceLocaleString: amount.toLocaleString(),
                      tokenValue: 5500,
                      photoUrl: 'url',
                      decimals: 18,
                    },
                  ],
                  multisigBalance: '',
                  activeDelegationsRows: [],
                  isMultiWalletMode: false,
                  isInReadOnlyMode: true,
                  totalUsdValue: 0,
                },
              },
            },
          },
        );

        const availableBalanceText = getByTestId('dab-text');

        expect(availableBalanceText).toBeInTheDocument();
        expect(availableBalanceText).toHaveTextContent(
          `Available: ${expectedFormattedAmount} ${tokenIdentifier}`,
        );
      });
    },
  );

  const maxDecimalsExceededTestCases = [
    {
      maxDecimals: 14, // testing purposes
      tokenIdentifier: 'EGLD',
      expectedAmountError: 'Maximum 14 decimals allowed',
      userInputValue: 1.123456789123456,
    },
    {
      maxDecimals: 6,
      tokenIdentifier: 'USDC',
      expectedAmountError: 'Maximum 6 decimals allowed',
      userInputValue: 1.1234567,
    },
  ];

  maxDecimalsExceededTestCases.forEach(
    ({ maxDecimals, expectedAmountError, userInputValue, tokenIdentifier }) => {
      it(`should display error on blur when decimals exceeded: ${expectedAmountError}`, async () => {
        const props = {
          ...baseProps,
        };

        const { getByTestId, getByText } = renderWithProviders(
          <AmountInputWithTokenSelection {...props} />,
          {
            preloadedState: {
              modals: {
                proposeModal: {
                  selectedOption: null,
                },
                proposeMultiselectModal: {
                  selectedOption: null,
                },
                performActionModal: {
                  selectedAction: null,
                  selectedToken: {
                    identifier: tokenIdentifier,
                  },
                  selectedNft: null,
                  selectedStakingProvider: null,
                  selectedTemplateForSaving: null,
                  selectedTemplateForCreation: null,
                },
              },
              accountGeneralInfo: {
                ...{
                  address: '',
                  nonce: 0,
                  balance: '',
                  rootHash: '',
                  txCount: 0,
                  username: '',
                  shard: 0,
                  tokenTableRows: [],
                  organizationTokens: [
                    {
                      prettyIdentifier: tokenIdentifier,
                      identifier: tokenIdentifier,
                      tokenPrice: 55,
                      balanceLocaleString: Number(100).toLocaleString(),
                      balance: 100,
                      tokenValue: 5500,
                      photoUrl: 'url',
                      decimals: maxDecimals,
                    },
                  ],
                  multisigBalance: '',
                  activeDelegationsRows: [],
                  isMultiWalletMode: false,
                  isInReadOnlyMode: true,
                  totalUsdValue: 0,
                },
              },
            },
          },
        );

        const numericInput = getByTestId('aiwts-numeric-format-input');
        expect(numericInput).toBeInTheDocument();

        await userEvent.type(numericInput, userInputValue.toString());
        await fireEvent.blur(numericInput);
        expect(numericInput).toHaveValue(userInputValue.toString());

        const errorText = getByText(expectedAmountError);
        expect(errorText).toBeInTheDocument();

        const amountError = getByTestId('aiwts-amount-error');
        expect(amountError).toHaveTextContent(expectedAmountError);
      });
    },
  );
});
