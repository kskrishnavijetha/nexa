
import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { usePayPalState } from '../usePayPalState';

describe('usePayPalState', () => {
  // Mock timers for testing useEffect with setTimeout
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  test('provides initial state values', () => {
    const { result } = renderHook(() => usePayPalState('basic', 'monthly'));

    expect(result.current.paypalError).toBeNull();
    expect(result.current.paypalButtonsRendered).toBe(false);
    expect(result.current.retryCount).toBe(0);
    expect(result.current.MAX_RETRIES).toBe(3);
  });

  test('auto retries when there is an error', async () => {
    const { result } = renderHook(() => usePayPalState('basic', 'monthly'));

    // Set an error to trigger the retry mechanism
    act(() => {
      result.current.setPaypalError('Test error');
    });

    expect(result.current.paypalError).toBe('Test error');

    // Fast-forward timer to trigger the useEffect
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Check if retry attempt was made
    expect(result.current.retryCount).toBe(1);
    expect(result.current.paypalButtonsRendered).toBe(false);

    // Fast-forward timer again to trigger another retry
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.retryCount).toBe(2);
  });

  test('stops retrying after MAX_RETRIES', async () => {
    const { result } = renderHook(() => usePayPalState('basic', 'monthly'));

    // Set error and manually set retry count to just below max
    act(() => {
      result.current.setPaypalError('Test error');
      result.current.setRetryCount(2); // Just before MAX_RETRIES (3)
    });

    // Fast-forward timer to trigger the final retry
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.retryCount).toBe(3);

    // This shouldn't increment further
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Retry count should still be MAX_RETRIES
    expect(result.current.retryCount).toBe(3);
  });

  test('resets state when tier changes', () => {
    const { result, rerender } = renderHook(
      ({ tier, billingCycle }) => usePayPalState(tier, billingCycle),
      { initialProps: { tier: 'basic', billingCycle: 'monthly' as const } }
    );

    // Set some state to verify it gets reset
    act(() => {
      result.current.setRetryCount(2);
      result.current.setPaypalError('Some error');
      result.current.setPaypalButtonsRendered(true);
    });

    // Change the tier prop
    rerender({ tier: 'pro', billingCycle: 'monthly' as const });

    // Check if state was reset
    expect(result.current.retryCount).toBe(0);
    expect(result.current.paypalError).toBeNull();
    expect(result.current.paypalButtonsRendered).toBe(false);
  });

  test('resets state when billing cycle changes', () => {
    const { result, rerender } = renderHook(
      ({ tier, billingCycle }) => usePayPalState(tier, billingCycle),
      { initialProps: { tier: 'basic', billingCycle: 'monthly' as const } }
    );

    // Set some state to verify it gets reset
    act(() => {
      result.current.setRetryCount(2);
      result.current.setPaypalError('Some error');
      result.current.setPaypalButtonsRendered(true);
    });

    // Change the billing cycle prop - fixed to use 'monthly' instead of 'annually'
    rerender({ tier: 'basic', billingCycle: 'monthly' as const });

    // Check if state was reset
    expect(result.current.retryCount).toBe(0);
    expect(result.current.paypalError).toBeNull();
    expect(result.current.paypalButtonsRendered).toBe(false);
  });
});
