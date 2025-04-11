
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FreePlanButton from '../FreePlanButton';
import * as paymentService from '@/utils/paymentService';

// Mock the paymentService
jest.mock('@/utils/paymentService', () => ({
  shouldUpgrade: jest.fn(),
}));

describe('FreePlanButton', () => {
  const mockOnActivate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with activate text when upgrade not needed', () => {
    // Mock shouldUpgrade to return false
    jest.spyOn(paymentService, 'shouldUpgrade').mockReturnValue(false);
    
    render(<FreePlanButton onActivate={mockOnActivate} loading={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Activate Free Plan');
    expect(button).not.toBeDisabled();
  });

  it('renders with upgrade text when upgrade needed', () => {
    // Mock shouldUpgrade to return true
    jest.spyOn(paymentService, 'shouldUpgrade').mockReturnValue(true);
    
    render(<FreePlanButton onActivate={mockOnActivate} loading={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Select a Paid Plan');
  });

  it('shows loading state when loading prop is true', () => {
    render(<FreePlanButton onActivate={mockOnActivate} loading={true} />);
    
    const loadingIcon = screen.getByTestId('loader') || screen.getByRole('img', { hidden: true });
    const button = screen.getByRole('button');
    
    expect(loadingIcon).toBeInTheDocument();
    expect(button).toHaveTextContent('Processing...');
    expect(button).toBeDisabled();
  });

  it('calls onActivate when clicked', () => {
    jest.spyOn(paymentService, 'shouldUpgrade').mockReturnValue(false);
    
    render(<FreePlanButton onActivate={mockOnActivate} loading={false} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnActivate).toHaveBeenCalledTimes(1);
  });
});
