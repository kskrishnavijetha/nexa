
// Jest setup file
import '@testing-library/jest-dom';

// This extends Jest's expect to include DOM-specific matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(content: string | RegExp): R;
      toBeVisible(): R;
    }
  }
}
