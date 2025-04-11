
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'sonner';
import PaymentButtons from '../PaymentButtons';
import * as paymentService from '@/utils/paymentService';

// Mock child components
vi.mock('../FreePlanButton', () => ({
  default: ({ onSuccess, loading, setLoading }: any) => (
    <button 
      data-testid="free-plan-button"
      onClick={() => onSuccess('free_test_id')}
    >
      Free Plan Button
    </button>
  )
}));

vi.mock('../PayPalContainer', () => ({
  default: (props: any) => (
    <div data-testid="paypal-container">
      <button 
        data-testid="mock-paypal-approve" 
        onClick={() => props.onApprove({ subscriptionID: 'test_sub_id' })}
      >
        Approve PayPal
      </button>
      <button 
        data-testid="mock-paypal-error" 
        onClick={() => props.onError(new Error('PayPal Error'))}
      >
        Trigger PayPal Error
      </button>
    </div>
  )
}));

vi.mock('../usePayPalState', () => ({
  usePayPalState: () => ({
    paypalError: null,
    setPaypalError: vi.fn(),
    paypalButtonsRendered: true,
    setPaypalButtonsRendered: vi.fn(),
    retryCount: 0,
    setRetryCount: vi.fn(),
    MAX_RETRIES: 3
  })
}));

// Mock other dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/utils/paymentService', () => ({
  saveSubscription: vi.fn()
}));

describe('PaymentButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders FreePlanButton for free tier', () => {
    render(
      <PaymentButtons 
        tier="free"
        loading={false}
        setLoading={vi.fn()}
        billingCycle="monthly"
      />
    );
    
    expect(screen.getByTestId('free-plan-button')).toBeInTheDocument();
    expect(screen.queryByTestId('paypal-container')).not.toBeInTheDocument();
  });

  test('renders PayPalContainer for paid tiers', () => {
    render(
      <PaymentButtons 
        tier="basic"
        loading={false}
        setLoading={vi.fn()}
        billingCycle="monthly"
      />
    );
    
    expect(screen.queryByTestId('free-plan-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('paypal-container')).toBeInTheDocument();
  });

  test('handles free plan activation successfully', async () => {
    const onSuccessMock = vi.fn();
    const setLoadingMock = vi.fn();
    
    render(
      <PaymentButtons 
        tier="free"
        loading={false}
        setLoading={setLoadingMock}
        billingCycle="monthly"
        onSuccess={onSuccessMock}
      />
    );
    
    fireEvent.click(screen.getByTestId('free-plan-button'));
    
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledWith('free_test_id');
    });
  });

  test('handles PayPal approval successfully', async () => {
    const onSuccessMock = vi.fn();
    const setLoadingMock = vi.fn();
    
    render(
      <PaymentButtons 
        tier="basic"
        loading={false}
        setLoading={setLoadingMock}
        billingCycle="monthly"
        onSuccess={onSuccessMock}
      />
    );
    
    fireEvent.click(screen.getByTestId('mock-paypal-approve'));
    
    await waitFor(() => {
      // Check if subscription was saved
      expect(paymentService.saveSubscription).toHaveBeenCalledWith('basic', 'test_sub_id', 'monthly');
      // Check if success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Basic plan activated!');
      // Check if onSuccess callback was called
      expect(onSuccessMock).toHaveBeenCalledWith('test_sub_id');
      // Check if loading state was updated
      expect(setLoadingMock).toHaveBeenCalledWith(false);
    });
  });

  test('handles PayPal error', async () => {
    const setLoadingMock = vi.fn();
    
    render(
      <PaymentButtons 
        tier="pro"
        loading={false}
        setLoading={setLoadingMock}
        billingCycle="monthly"
      />
    );
    
    fireEvent.click(screen.getByTestId('mock-paypal-error'));
    
    await waitFor(() => {
      // Check if error toast was shown
      expect(toast.error).toHaveBeenCalledWith('PayPal payment failed. Please try again.');
      // Check if loading state was updated
      expect(setLoadingMock).toHaveBeenCalledWith(false);
    });
  });
});
