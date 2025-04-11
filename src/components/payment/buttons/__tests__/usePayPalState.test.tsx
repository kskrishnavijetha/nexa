
import { renderHook, act } from '@testing-library/react-hooks';
import usePayPalState from '../usePayPalState';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('usePayPalState', () => {
  const mockOnSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('initializes with default state', () => {
    const { result } = renderHook(() => usePayPalState({
      onSuccess: mockOnSuccess,
      tier: 'basic',
    }));
    
    expect(result.current.loading).toBe(false);
  });
  
  it('sets loading state correctly during operations', () => {
    const { result } = renderHook(() => usePayPalState({
      onSuccess: mockOnSuccess,
      tier: 'pro',
    }));
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.loading).toBe(true);
    
    act(() => {
      result.current.setLoading(false);
    });
    
    expect(result.current.loading).toBe(false);
  });
  
  it('handles PayPal success correctly', () => {
    const { result } = renderHook(() => usePayPalState({
      onSuccess: mockOnSuccess,
      tier: 'enterprise',
    }));
    
    act(() => {
      result.current.handlePayPalSuccess({ subscriptionID: 'test-sub-id' });
    });
    
    expect(toast.success).toHaveBeenCalledWith('Enterprise plan activated!');
    expect(mockOnSuccess).toHaveBeenCalledWith('test-sub-id');
  });
  
  it('handles PayPal error correctly', () => {
    const { result } = renderHook(() => usePayPalState({
      onSuccess: mockOnSuccess,
      tier: 'basic',
    }));
    
    act(() => {
      result.current.handlePayPalError(new Error('Test PayPal error'));
    });
    
    expect(toast.error).toHaveBeenCalledWith('PayPal payment failed. Please try again.');
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('handles free plan activation correctly', async () => {
    const { result } = renderHook(() => usePayPalState({
      onSuccess: mockOnSuccess,
      tier: 'free',
    }));
    
    await act(async () => {
      await result.current.handleFreePlanActivation();
    });
    
    expect(toast.success).toHaveBeenCalledWith('Free plan activated!');
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
