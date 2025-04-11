
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import PaymentButtons from '../PaymentButtons';
import FreePlanButton from '../FreePlanButton';
import PayPalContainer from '../PayPalContainer';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../FreePlanButton', () => {
  return jest.fn(props => (
    <button onClick={props.onActivate} disabled={props.loading}>
      Free Plan Button
    </button>
  ));
});

jest.mock('../PayPalContainer', () => {
  return jest.fn(props => (
    <div>
      <span>PayPal Container Mock</span>
      <button onClick={() => props.onSuccess({ subscriptionID: 'test-id' })}>
        Success
      </button>
      <button onClick={() => props.onError(new Error('Test error'))}>
        Error
      </button>
    </div>
  ));
});

describe('PaymentButtons', () => {
  const mockOnSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders FreePlanButton for free tier', () => {
    render(<PaymentButtons tier="free" billingCycle="monthly" onSuccess={mockOnSuccess} />);
    
    expect(FreePlanButton).toHaveBeenCalled();
    expect(PayPalContainer).not.toHaveBeenCalled();
    
    const button = screen.getByText('Free Plan Button');
    fireEvent.click(button);
    
    expect(toast.success).toHaveBeenCalledWith('Free plan activated!');
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('renders PayPalContainer for paid tiers', () => {
    render(<PaymentButtons tier="basic" billingCycle="monthly" onSuccess={mockOnSuccess} />);
    
    expect(FreePlanButton).not.toHaveBeenCalled();
    expect(PayPalContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: 'basic',
      }),
      expect.anything()
    );
    
    const successButton = screen.getByText('Success');
    fireEvent.click(successButton);
    
    expect(toast.success).toHaveBeenCalledWith('Basic plan activated!');
    expect(mockOnSuccess).toHaveBeenCalledWith('test-id');
  });

  it('handles PayPal errors correctly', () => {
    render(<PaymentButtons tier="pro" billingCycle="monthly" onSuccess={mockOnSuccess} />);
    
    const errorButton = screen.getByText('Error');
    fireEvent.click(errorButton);
    
    expect(toast.error).toHaveBeenCalledWith('PayPal payment failed. Please try again.');
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
