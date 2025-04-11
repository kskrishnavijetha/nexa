
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import PayPalContainer from '../PayPalContainer';
import * as paymentService from '@/utils/paymentService';

// Mock the paymentService
jest.mock('@/utils/paymentService', () => ({
  loadPayPalScript: jest.fn(),
  createPayPalButtons: jest.fn(),
}));

describe('PayPalContainer', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockSetLoading = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create a div for PayPal buttons to render into
    const div = document.createElement('div');
    div.id = 'paypal-button-container';
    document.body.appendChild(div);
  });
  
  afterEach(() => {
    // Clean up the div
    const div = document.getElementById('paypal-button-container');
    if (div) div.remove();
  });

  it('initializes PayPal when component mounts', async () => {
    jest.spyOn(paymentService, 'loadPayPalScript').mockResolvedValue();
    
    await act(async () => {
      render(
        <PayPalContainer
          plan="basic"
          onSuccess={mockOnSuccess}
          onError={mockOnError}
          loading={false}
          setLoading={mockSetLoading}
        />
      );
    });
    
    expect(paymentService.loadPayPalScript).toHaveBeenCalledTimes(1);
    expect(paymentService.createPayPalButtons).toHaveBeenCalledTimes(1);
    expect(mockSetLoading).toHaveBeenCalledTimes(2); // Once to set to true, once to false
    
    const container = screen.getByLabelText('PayPal payment options');
    expect(container).toBeInTheDocument();
  });
  
  it('shows loading state when loading prop is true', () => {
    render(
      <PayPalContainer
        plan="pro"
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        loading={true}
        setLoading={mockSetLoading}
      />
    );
    
    const loadingText = screen.getByText('Preparing PayPal...');
    const spinner = screen.getByTestId('loader') || screen.getByRole('img', { hidden: true });
    
    expect(loadingText).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });
  
  it('handles PayPal initialization error', async () => {
    const error = new Error('Failed to load PayPal');
    jest.spyOn(paymentService, 'loadPayPalScript').mockRejectedValue(error);
    
    await act(async () => {
      render(
        <PayPalContainer
          plan="enterprise"
          onSuccess={mockOnSuccess}
          onError={mockOnError}
          loading={false}
          setLoading={mockSetLoading}
        />
      );
    });
    
    expect(mockOnError).toHaveBeenCalledWith(error);
    expect(mockSetLoading).toHaveBeenLastCalledWith(false); // Ensures loading is set back to false
  });
});
