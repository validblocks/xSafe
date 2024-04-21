import { screen, within } from '@testing-library/react';
import CustomSelect from 'src/components/Utils/CustomSelect';
import { renderWithProviders } from './utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const mockOptions = [
  { displayValue: 'Light Theme', value: 'light' },
  { displayValue: 'Dark Theme', value: 'dark' },
];

describe('CustomSelect component', () => {
  it('should render', () => {
    const { container } = renderWithProviders(
      <CustomSelect options={mockOptions} label="Theme" />,
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with undefined options', () => {
    const { container } = renderWithProviders(
      <CustomSelect options={undefined as any} label="Theme" />,
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with undefined label', () => {
    const { container } = renderWithProviders(
      <CustomSelect options={undefined as any} label={undefined} />,
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with undefined handleSelectionChanged', () => {
    const { container } = renderWithProviders(
      <CustomSelect
        options={mockOptions}
        handleSelectionChanged={undefined as any}
      />,
    );
    expect(container).toBeInTheDocument();
  });

  it('should display label', async () => {
    renderWithProviders(<CustomSelect options={mockOptions} label="Theme" />);

    expect(await screen.findByText('Theme')).toBeInTheDocument();
  });

  it('should display dropdown', async () => {
    renderWithProviders(<CustomSelect options={mockOptions} label="Theme" />);

    expect(
      within(await screen.findByTestId('custom-select')).getByRole('button'),
    ).toBeInTheDocument();
  });

  it('should display options', async () => {
    renderWithProviders(<CustomSelect options={mockOptions} label="Theme" />);

    const dropdown = within(
      await screen.findByTestId('custom-select'),
    ).getByRole('button');

    await userEvent.click(dropdown);
    expect(
      await screen.findByRole('option', { name: 'Dark Theme' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Light Theme' }),
    ).toBeInTheDocument();
  });

  it('should display selected value', async () => {
    renderWithProviders(<CustomSelect options={mockOptions} label="Theme" />);

    const dropdown = within(
      await screen.findByTestId('custom-select'),
    ).getByRole('button');
    await userEvent.click(dropdown);
    await userEvent.click(
      await screen.findByRole('option', { name: 'Dark Theme' }),
    );
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
  });

  it('should have hover border color #4c2ffc', async () => {
    renderWithProviders(<CustomSelect options={mockOptions} label="Theme" />);

    const dropdown = within(
      await screen.findByTestId('custom-select'),
    ).getByRole('button');

    await userEvent.hover(dropdown);

    expect(await screen.findByTestId('custom-select')).toHaveStyle({
      border: 'solid 1px #4C2FFC',
    });
  });

  it('should call handleSelectionChanged when selection changes', async () => {
    const handleSelectionChangedMock = vi.fn();

    renderWithProviders(
      <CustomSelect
        options={mockOptions}
        label="Theme"
        handleSelectionChanged={handleSelectionChangedMock}
      />,
    );

    const dropdown = within(
      await screen.findByTestId('custom-select'),
    ).getByRole('button');

    userEvent.click(dropdown);

    await userEvent.click(
      await screen.findByRole('option', { name: 'Dark Theme' }),
    );

    expect(handleSelectionChangedMock).toHaveBeenCalledWith(
      expect.any(Object),
      mockOptions[1],
    );
  });
});
