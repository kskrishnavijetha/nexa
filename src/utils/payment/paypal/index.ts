
/**
 * Main PayPal service module that re-exports functionality
 */

// Re-export from SDK module
export { 
  loadPayPalScript,
  isPayPalSDKLoaded
} from './paypalSDK';

// Re-export from buttons module
export {
  createPayPalButtons
} from './paypalButtons';
