
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'sonner';
import FreePlanButton from '../FreePlanButton';
import * as paymentService from '@/utils/paymentService';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/utils/paymentService', () => ({
  saveSubscription: vi.fn(),
  shouldUpgrade: vi.fn()
}));

describe('FreePlanButton', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with correct text when upgrade not needed', () => {
    vi.mocked(paymentService.shouldUpgrade).mockReturnValue(false);
    
    render(<FreePlanButton loading={false} setLoading={vi.fn()} />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Activate Free Plan');
  });

  test('renders with correct text when upgrade needed', () => {
    vi.mocked(paymentService.shouldUpgrade).mockReturnValue(true);
    
    render(<FreePlanButton loading={false} setLoading={vi.fn()} />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Select a Paid Plan');
  });

  test('shows loading indicator when loading', () => {
    render(<FreePlanButton loading={true} setLoading={vi.fn()} />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('calls onSuccess when free plan activated successfully', async () => {
    vi.mocked(paymentService.shouldUpgrade).mockReturnValue(false);
    const onSuccessMock = vi.fn();
    const setLoadingMock = vi.fn();
    
    render(
      <FreePlanButton 
        onSuccess={onSuccessMock} 
        loading={false} 
        setLoading={setLoadingMock}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    // Should start loading
    expect(setLoadingMock).toHaveBeenCalledWith(true);
    
    await waitFor(() => {
      // Should call saveSubscription
      expect(paymentService.saveSubscription).toHaveBeenCalledWith('free', expect.any(String), 'monthly');
      // Should show success toast
      expect(toast.success).toHaveBeenCalled();
      // Should call onSuccess with subscription ID
      expect(onSuccessMock).toHaveBeenCalledWith(expect.any(String));
      // Should stop loading
      expect(setLoadingMock).toHaveBeenCalledWith(false);
    });
  });

  test('shows info toast when upgrade needed', async () => {
    vi.mocked(paymentService.shouldUpgrade).mockReturnValue(true);
    const setLoadingMock = vi.fn();
    
    render(
      <FreePlanButton 
        loading={false} 
        setLoading={setLoadingMock}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      // Should show info toast
      expect(toast.info).toHaveBeenCalledWith('Please select a paid plan to continue');
      // Should stop loading
      expect(setLoadingMock).toHaveBeenCalledWith(false);
    });
  });

  test('handles errors gracefully', async () => {
    vi.mocked(paymentService.shouldUpgrade).mockReturnValue(false);
    vi.mocked(paymentService.saveSubscription).mockImplementation(() => {
      throw new Error('Test error');
    });

    const setLoadingMock = vi.fn();
    
    render(
      <FreePlanButton 
        loading={false} 
        setLoading={setLoadingMock}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      // Should show error toast
      expect(toast.error).toHaveBeenCalledWith('Failed to activate free plan. Please try again.');
      // Should stop loading
      expect(setLoadingMock).toHaveBeenCalledWith(false);
    });
  });
});
