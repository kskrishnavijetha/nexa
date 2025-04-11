
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PayPalContainer from '../PayPalContainer';
import * as paymentService from '@/utils/paymentService';

// Mock dependencies
vi.mock('@/utils/paymentService', () => ({
  loadPayPalScript: vi.fn(),
  isPayPalSDKLoaded: vi.fn(),
  createPayPalButtons: vi.fn()
}));

describe('PayPalContainer', () => {
  // Create refs for the props
  const defaultProps = {
    tier: 'basic',
    billingCycle: 'monthly' as const,
    loading: false,
    setLoading: vi.fn(),
    onApprove: vi.fn(),
    onError: vi.fn(),
    paypalError: null,
    setPaypalError: vi.fn(),
    retryCount: 0,
    setRetryCount: vi.fn(),
    setPaypalButtonsRendered: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(paymentService.isPayPalSDKLoaded).mockReturnValue(true);
    vi.mocked(paymentService.createPayPalButtons).mockResolvedValue(true);
    
    // Mock DOM elements for PayPal
    const paypalContainer = document.createElement('div');
    paypalContainer.id = 'paypal-button-container';
    document.body.appendChild(paypalContainer);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders container for PayPal buttons', () => {
    render(<PayPalContainer {...defaultProps} />);
    
    expect(screen.getByText(/PayPal subscription will be processed securely/i)).toBeInTheDocument();
    expect(screen.getByTestId('paypal-container')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    render(<PayPalContainer {...defaultProps} loading={true} />);
    
    expect(screen.getByText(/Preparing payment options/i)).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders error state with retry button', () => {
    render(
      <PayPalContainer 
        {...defaultProps} 
        paypalError="Failed to load PayPal"
      />
    );
    
    expect(screen.getByText(/Failed to load PayPal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  test('retry button calls initialization function', async () => {
    render(
      <PayPalContainer 
        {...defaultProps} 
        paypalError="Failed to load PayPal"
      />
    );
    
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    fireEvent.click(retryButton);
    
    await waitFor(() => {
      expect(paymentService.loadPayPalScript).toHaveBeenCalled();
    });
  });

  test('initializes PayPal on mount if not rendered', async () => {
    render(<PayPalContainer {...defaultProps} />);
    
    await waitFor(() => {
      expect(paymentService.loadPayPalScript).toHaveBeenCalled();
      expect(paymentService.createPayPalButtons).toHaveBeenCalledWith(
        'paypal-button-container',
        'basic',
        'monthly',
        defaultProps.onApprove,
        defaultProps.onError
      );
      expect(defaultProps.setPaypalButtonsRendered).toHaveBeenCalledWith(true);
    });
  });

  test('handles PayPal script load error', async () => {
    vi.mocked(paymentService.loadPayPalScript).mockRejectedValue(new Error('Script load failed'));
    
    render(<PayPalContainer {...defaultProps} />);
    
    await waitFor(() => {
      expect(defaultProps.setPaypalError).toHaveBeenCalledWith(expect.stringContaining('Failed to load PayPal'));
    });
  });

  test('handles PayPal button creation error', async () => {
    vi.mocked(paymentService.createPayPalButtons).mockResolvedValue(false);
    
    render(<PayPalContainer {...defaultProps} />);
    
    await waitFor(() => {
      expect(defaultProps.setPaypalError).toHaveBeenCalledWith(expect.stringContaining('Failed to set up PayPal'));
    });
  });
});
