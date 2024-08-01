import { fireEvent, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders } from './utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { TransactionBuilderMain } from 'src/components/TransactionBuilder/TransactionBuilderMain';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';

const ABI = `{
    "endpoints": [
        {
            "inputs": [],
            "mutability": "mutable",
            "name": "claimAll",
            "outputs": [],
            "payableInTokens": [
                "*"
            ]
        },
        {
            "inputs": [
                {
                    "name": "og_nonce",
                    "type": "u64"
                }
            ],
            "mutability": "mutable",
            "name": "claimRandomNft",
            "outputs": [],
            "payableInTokens": [
                "EGLD"
            ]
        }
    ],
    "name": "InspireReferral"
}`;

describe('TransactionBuilderMain component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render without crashing', () => {
    const { container } = renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    expect(container).toBeInTheDocument();
  });

  it('Should render without optional props', () => {
    const { container } = renderWithProviders(
      <TransactionBuilderMain abi={''} />,
    );

    expect(container).toBeInTheDocument();
  });

  it('Should have a Smart Contract Address Input with Enter Smart Contract Address placeholder', () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    expect(
      screen.getByPlaceholderText('Enter Smart Contract Address'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('address-input')).toBeInTheDocument();
  });

  it('Should render an AmountInputWithTokenSelection component with max button', () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    expect(
      screen.getByTestId('aiwts-amount-with-token-selection-box'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('aiwts-numeric-format-input'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('aiwts-amount-label')).toBeInTheDocument();
    expect(screen.getByTestId('aiwts-max-button')).toBeInTheDocument();
  });

  it('Should be in Custom Data mode initially', () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('cdb-container')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-title')).toBeInTheDocument();
  });

  it('Should render a switch with 2 options: "Custom Data" and "Use ABI"', () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('custom-data-switch')).toBeInTheDocument();
    expect(screen.getByTestId('custom-data-option')).toBeInTheDocument();
    expect(screen.getByTestId('use-abi-option')).toBeInTheDocument();
  });

  it('Should be in Custom Data mode initially and switch to be disabled', () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).not.toBeChecked();

    expect(screen.getByTestId('custom-data-switch')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-container')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-title')).toBeInTheDocument();
  });

  it('Should have a disabled Create proposal button initially', () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Create proposal')).toBeInTheDocument();
    expect(screen.getByText('Create proposal')).toBeDisabled();
  });

  it('Should handle ABI switch and display ABI input field', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('cdb-container')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-title')).toBeInTheDocument();

    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).not.toBeChecked();

    await userEvent.click(switchInput);

    expect(switchInput).toBeChecked();
    expect(screen.queryByTestId('cdb-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cdb-title')).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Paste Smart Contract ABI'),
    ).toBeInTheDocument();
  });

  it('Should call handleAbiAsTextChanged when ABI is changed', async () => {
    const handleAbiAsTextChanged = vi.fn();

    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={handleAbiAsTextChanged}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const switchInput = screen.getByRole('checkbox');
    await userEvent.click(switchInput);

    const abiInput = screen.getByPlaceholderText('Paste Smart Contract ABI');
    await userEvent.type(abiInput, 'Test ABI');

    expect(handleAbiAsTextChanged).toHaveBeenCalled();
  });

  it('Should display error message for invalid ABI', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={'invalid ABI'}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const switchInput = screen.getByRole('checkbox');
    await userEvent.click(switchInput);

    expect(screen.getByText('Invalid ABI')).toBeInTheDocument();
  });

  it('Should display error message for invalid hex string length', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();

    const argumentInput = screen.getByPlaceholderText('Argument 1');
    await userEvent.type(argumentInput, 'aa1');

    expect(argumentInput).toHaveValue('aa1');
    expect(screen.getByTestId('cdb-argument-1-error')).toBeInTheDocument();
    expect(screen.getByText('Invalid hex string length')).toBeInTheDocument();
  });

  it('Should display error message for invalid hex string character', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();

    const argumentInput = screen.getByPlaceholderText('Argument 1');
    await userEvent.type(argumentInput, 'ss');

    expect(argumentInput).toHaveValue('ss');
    expect(screen.getByTestId('cdb-argument-1-error')).toBeInTheDocument();
    expect(screen.getByText('Invalid hex characters')).toBeInTheDocument();
  });

  it('Should add and handle multiple arguments correctly without ABI', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);
    await userEvent.click(addArgumentButton);
    await userEvent.click(addArgumentButton);

    const argument1Input = screen.getByPlaceholderText('Argument 1');
    const argument2Input = screen.getByPlaceholderText('Argument 2');
    const argument3Input = screen.getByPlaceholderText('Argument 3');

    await userEvent.type(argument1Input, 'aa');
    await userEvent.type(argument2Input, 'a');
    await userEvent.type(argument3Input, 'ss');

    expect(argument1Input).toHaveValue('aa');
    expect(argument2Input).toHaveValue('a');
    expect(argument3Input).toHaveValue('ss');
  });

  it('Should validate and display errors for each argument without ABI', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);
    await userEvent.click(addArgumentButton);
    await userEvent.click(addArgumentButton);

    const argument1Input = screen.getByPlaceholderText('Argument 1');
    const argument2Input = screen.getByPlaceholderText('Argument 2');
    const argument3Input = screen.getByPlaceholderText('Argument 3');

    await userEvent.type(argument1Input, 'aa');
    await userEvent.type(argument2Input, 'a');
    await userEvent.type(argument3Input, 'ss');

    expect(argument1Input).toHaveValue('aa');
    expect(argument2Input).toHaveValue('a');
    expect(argument3Input).toHaveValue('ss');

    expect(
      screen.queryByTestId('cdb-argument-1-error'),
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId('cdb-argument-2-error')).toBeInTheDocument();
    expect(screen.queryByTestId('cdb-argument-2-error')).toHaveTextContent(
      'Invalid hex string length',
    );

    expect(screen.queryByTestId('cdb-argument-3-error')).toBeInTheDocument();
    expect(screen.queryByTestId('cdb-argument-3-error')).toHaveTextContent(
      'Invalid hex characters',
    );
  });

  it('Should disable Create Proposal button if any argument has errors in Custom Data Mode', async () => {
    renderWithProviders(<TransactionBuilderMain abi={''} />);

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    const argument1Input = screen.getByPlaceholderText('Argument 1');
    await userEvent.type(argument1Input, 'aa');

    const addressInput = screen.getByPlaceholderText(
      'Enter Smart Contract Address',
    );
    await userEvent.type(
      addressInput,
      'erd1qqqqqqqqqqqqqpgqtgysergzw6lxv9kepk2hm466huvkgjr9r78s7swzhl',
    );

    expect(screen.getByText('Create proposal')).toBeEnabled();

    await userEvent.click(addArgumentButton);

    const argument2Input = screen.getByPlaceholderText('Argument 2');
    await userEvent.type(argument2Input, 's');

    expect(screen.getByText('Create proposal')).toBeDisabled();
  });

  it('Should disable Create Proposal button if function name is emptied in Custom Data Mode', async () => {
    renderWithProviders(<TransactionBuilderMain abi={''} />);

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    const argument1Input = screen.getByPlaceholderText('Argument 1');
    await userEvent.type(argument1Input, 'aa');

    const addressInput = screen.getByPlaceholderText(
      'Enter Smart Contract Address',
    );
    await userEvent.type(
      addressInput,
      'erd1qqqqqqqqqqqqqpgqtgysergzw6lxv9kepk2hm466huvkgjr9r78s7swzhl',
    );

    expect(screen.getByText('Create proposal')).toBeEnabled();

    await userEvent.clear(functionNameInput);

    expect(screen.getByText('Create proposal')).toBeDisabled();
  });

  it('Should disable Create Proposal button if smart contract address is emptied in Custom Data Mode', async () => {
    renderWithProviders(<TransactionBuilderMain abi={''} />);

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    const argument1Input = screen.getByPlaceholderText('Argument 1');
    await userEvent.type(argument1Input, 'aa');

    const addressInput = screen.getByPlaceholderText(
      'Enter Smart Contract Address',
    );
    await userEvent.type(
      addressInput,
      'erd1qqqqqqqqqqqqqpgqtgysergzw6lxv9kepk2hm466huvkgjr9r78s7swzhl',
    );

    expect(screen.getByText('Create proposal')).toBeEnabled();

    await userEvent.clear(addressInput);

    expect(screen.getByText('Create proposal')).toBeDisabled();
  });

  it('Should enable Create Proposal button when all conditions are met in Custom Data Mode', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={''}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    await userEvent.type(functionNameInput, 'myFunction');

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    const argument1Input = screen.getByPlaceholderText('Argument 1');
    await userEvent.type(argument1Input, 'aa');

    const addressInput = screen.getByPlaceholderText(
      'Enter Smart Contract Address',
    );
    await userEvent.type(
      addressInput,
      'erd1qqqqqqqqqqqqqpgqtgysergzw6lxv9kepk2hm466huvkgjr9r78s7swzhl',
    );

    expect(screen.getByText('Create proposal')).toBeEnabled();
  });

  it('Should enable Create Proposal button when all conditions are met in Use ABI Mode', async () => {
    renderWithProviders(
      <TransactionBuilderMain
        abi={ABI}
        handleAbiAsTextChanged={vi.fn()}
        handleIsUseAbiEnabledChange={vi.fn()}
      />,
    );

    const switchInput = screen.getByRole('checkbox');
    await userEvent.click(switchInput);

    const addressInput = screen.getByPlaceholderText(
      'Enter Smart Contract Address',
    );
    await userEvent.type(
      addressInput,
      'erd1qqqqqqqqqqqqqpgqtgysergzw6lxv9kepk2hm466huvkgjr9r78s7swzhl',
    );

    const dropdown = within(
      await screen.findByTestId('custom-select'),
    ).getByRole('button');

    userEvent.click(dropdown);

    await userEvent.click(
      await screen.findByRole('option', { name: 'claimAll' }),
    );

    expect(screen.getByText('Create proposal')).toBeEnabled();
  });

  const customDataArgumentsTestCases = [
    {
      description:
        'Should call mutateSmartContractCall correctly with no arguments',
      functionName: 'myFunction',
      callAmount: { numeric: 123456.789, expectedFormatted: '123,456.789' },
      address: 'erd1qqqqqqqqqqqqqpgqtgysergzw6lxv9kepk2hm466huvkgjr9r78s7swzhl',
      arguments: [],
      expectedArguments: [
        new Address(
          'erd1qqqqqqqqqqqqqpgqtgysergzw6lxv9kepk2hm466huvkgjr9r78s7swzhl',
        ),
        new BigUIntValue(
          new BigNumber(Number('123456.789'))
            .shiftedBy(18)
            .decimalPlaces(0, BigNumber.ROUND_FLOOR),
        ),
        'myFunction',
      ],
    },
  ];

  customDataArgumentsTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      vi.mock('src/contracts/MultisigContract', () => ({
        mutateSmartContractCall: vi.fn(),
      }));

      renderWithProviders(
        <TransactionBuilderMain
          abi={''}
          handleAbiAsTextChanged={vi.fn()}
          handleIsUseAbiEnabledChange={vi.fn()}
        />,
        {
          preloadedState: {
            accountGeneralInfo: {
              ...{
                address: '',
                nonce: 0,
                balance: new BigNumber(0),
                rootHash: '',
                txCount: 0,
                username: '',
                shard: 0,
                tokenTableRows: [],
                organizationTokens: [
                  {
                    prettyIdentifier: 'EGLD',
                    identifier: 'EGLD',
                    tokenPrice: new BigNumber(55),
                    balanceLocaleString: new BigNumber(
                      '10000000000000000000000000000000000000000000000000000000000',
                    ).toLocaleString(),
                    balance: new BigNumber(
                      10000000000000000000000000000000000000000000000000000000000,
                    ),
                    tokenValue: new BigNumber(5500),
                    photoUrl: 'url',
                    decimals: 18,
                  },
                ],
                multisigBalance: new BigNumber(0),
                activeDelegationsRows: [],
                isMultiWalletMode: false,
                isInReadOnlyMode: true,
                totalUsdValue: new BigNumber(0),
              },
            },
          },
        },
      );

      const addressInput = screen.getByPlaceholderText(
        'Enter Smart Contract Address',
      );
      await userEvent.type(addressInput, testCase.address);

      const numericInput = screen.getByTestId('aiwts-numeric-format-input');
      expect(numericInput).toBeInTheDocument();

      await userEvent.type(
        numericInput,
        testCase.callAmount.numeric.toString(),
      );
      await fireEvent.blur(numericInput);
      expect(numericInput).toHaveValue(testCase.callAmount.expectedFormatted);

      const functionNameInput = screen.getByTestId('cdb-function-name-input');
      await userEvent.type(functionNameInput, testCase.functionName);

      const addArgumentButton = screen.getByTestId('cdb-add-argument-button');

      for (const argument of testCase.arguments) {
        await userEvent.click(addArgumentButton);
        const argumentInput = screen.getByPlaceholderText(
          `Argument ${testCase.arguments.indexOf(argument) + 1}`,
        );
        await userEvent.type(argumentInput, argument);
      }

      const createProposalButton = screen.getByText('Create proposal');
      expect(screen.getByText('Create proposal')).toBeEnabled();
      await fireEvent.click(createProposalButton);

      expect(mutateSmartContractCall).toHaveBeenCalledWith(
        ...testCase.expectedArguments,
      );
    });
  });
});
