import { fireEvent, screen } from '@testing-library/react';
import { CustomDataBuilder } from 'src/components/TransactionBuilder/CustomDataBuilder';
import { vi } from 'vitest';
import { renderWithProviders } from './utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { TransactionBuilderMain } from 'src/components/TransactionBuilder/TransactionBuilderMain';

describe('CustomDataBuilder component', () => {
  const mockHandleFunctionNameChange = vi.fn();
  const mockHandleFunctionNameBlur = vi.fn();
  const mockHandleNewArgs = vi.fn();
  const mockHandleFormKeyChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render without crashing', () => {
    const { container } = renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );
    expect(container).toBeInTheDocument();
  });

  it('Should render without optional props', () => {
    const { container } = renderWithProviders(<CustomDataBuilder />);
    expect(container).toBeInTheDocument();
  });

  it('Should display "Custom Data" title', () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );
    expect(screen.getByText('Custom Data')).toBeInTheDocument();
  });

  it('Should display "Function name" input', () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    expect(screen.getByTestId('cdb-function-name-input')).toBeInTheDocument();
  });

  it('Should display "Enter function name" placeholder', () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    expect(
      screen.getByPlaceholderText('Enter function name'),
    ).toBeInTheDocument();
  });

  it('Should display function name input field', () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );
    const functionNameInput = screen.getByTestId('cdb-function-name-input');
    expect(functionNameInput).toBeInTheDocument();
  });

  it('Should call handleFunctionNameChange on function name input change', () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    const functionNameInput = screen.getByRole('textbox');
    fireEvent.change(functionNameInput, { target: { value: 'some text' } });
    expect(mockHandleFunctionNameChange).toHaveBeenCalled();
  });

  it('Should call handleFunctionNameBlur on function name input blur', () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );
    const functionNameInput = screen.getByRole('textbox');
    fireEvent.change(functionNameInput, { target: { value: 'some text' } });
    fireEvent.blur(functionNameInput);
    expect(mockHandleFunctionNameBlur).toHaveBeenCalled();
  });

  it('Should not display "Add argument" button when function name is empty', async () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    const addArgumentButton = screen.queryByTestId('cdb-add-argument-button');
    expect(addArgumentButton).not.toBeInTheDocument();
  });

  it('Should display "Add argument" button after function name is not empty', async () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    let addArgumentButton = screen.queryByTestId('cdb-add-argument-button');
    expect(addArgumentButton).not.toBeInTheDocument();

    const functionNameInput = screen.getByRole('textbox');
    await fireEvent.change(functionNameInput, {
      target: { value: 'some text' },
    });

    addArgumentButton = screen.queryByTestId('cdb-add-argument-button');
    expect(addArgumentButton).not.toBeNull();
    expect(addArgumentButton).toBeInTheDocument();
  });

  it('Should not have any argument fields until the "Add argument" button is clicked', async () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );
    const functionNameInput = screen.getByRole('textbox');
    await fireEvent.change(functionNameInput, {
      target: { value: 'some text' },
    });

    const arg1Input = screen.queryByTestId('cdb-argument-1-text-input');
    expect(arg1Input).toBeNull();
    expect(arg1Input).not.toBeInTheDocument();
  });

  it('Should add a new argument field when "Add argument" button is clicked', async () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );
    const functionNameInput = screen.getByRole('textbox');
    await fireEvent.change(functionNameInput, {
      target: { value: 'some text' },
    });

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();

    await userEvent.click(addArgumentButton);
    expect(screen.getByTestId('cdb-argument-2-text-input')).toBeInTheDocument();
  });

  it('Should remove an argument field when remove button is clicked', async () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    const functionNameInput = screen.getByRole('textbox');
    await fireEvent.change(functionNameInput, {
      target: { value: 'some text' },
    });

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();

    const removeArgumentButton = screen.getByTestId(
      'cdb-remove-argument-1-button',
    );
    await userEvent.click(removeArgumentButton);

    expect(
      screen.queryByTestId('cdb-argument-1-text-input'),
    ).not.toBeInTheDocument();
  });

  it('Should remove an argument field and rearrange remaining arguments', async () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    const functionNameInput = screen.getByRole('textbox');
    await fireEvent.change(functionNameInput, {
      target: { value: 'some text' },
    });

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);
    await userEvent.click(addArgumentButton);
    await userEvent.click(addArgumentButton);

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-argument-2-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-argument-3-text-input')).toBeInTheDocument();

    const removeArgument2Button = screen.getByTestId(
      'cdb-remove-argument-2-button',
    );
    await userEvent.click(removeArgument2Button);

    expect(
      screen.queryByTestId('cdb-argument-1-text-input'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('cdb-argument-2-text-input'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('cdb-argument-3-text-input'),
    ).not.toBeInTheDocument();
  });

  it('Should not display error message on initial render', async () => {
    renderWithProviders(
      <CustomDataBuilder
        handleFunctionNameChange={mockHandleFunctionNameChange}
        handleFunctionNameBlur={mockHandleFunctionNameBlur}
        handleNewArgs={mockHandleNewArgs}
        handleFormKeyChange={mockHandleFormKeyChange}
      />,
    );

    const functionNameInput = screen.getByRole('textbox');
    await fireEvent.change(functionNameInput, {
      target: { value: 'some text' },
    });

    const addArgumentButton = screen.getByTestId('cdb-add-argument-button');
    await userEvent.click(addArgumentButton);

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();
    expect(
      screen.queryByTestId('cdb-argument-1-error'),
    ).not.toBeInTheDocument();
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

  it('Should handle state correctly for each argument added', async () => {
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

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-argument-2-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-argument-3-text-input')).toBeInTheDocument();

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

  it('Should handle errors correctly for each argument added', async () => {
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

    expect(screen.getByTestId('cdb-argument-1-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-argument-2-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('cdb-argument-3-text-input')).toBeInTheDocument();

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
});
