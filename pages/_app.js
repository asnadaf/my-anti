import { ThemeProvider } from 'next-themes';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { useEffect } from 'react';
import { Toaster } from "../components/ui/toaster";
import { CartProvider } from '../contexts/CartContext';

// Global error handler
const handleError = (error, errorInfo) => {
  console.error('Global Error:', error);
  // console.error('Error Info:', errorInfo);
  
  // You can add additional error reporting here (e.g., send to error tracking service)
  if (process.env.NODE_ENV === 'development') {
    // debugger; // This will pause execution in development mode
  }
};

// Global unhandled promise rejection handler
const handleUnhandledRejection = (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  if (process.env.NODE_ENV === 'development') {
    // debugger;
  }
};

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Add global error handlers
    window.addEventListener('error', (event) => handleError(event.error, event));
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Add console debugging helpers
    if (process.env.NODE_ENV === 'development') {
      window.debug = {
        // Add any custom debug functions here
        logProps: (componentName) => {
          console.log(`Props for ${componentName}:`, pageProps);
        },
        logState: (componentName) => {
          console.log(`State for ${componentName}:`, Component.state);
        }
      };
    }

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </CartProvider>
    </ThemeProvider>
  );
} 