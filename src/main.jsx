import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ReactPixel from 'react-facebook-pixel';

// Facebook Pixel initialization function
function RootApp() {
  useEffect(() => {
    const pixelId = '834554985820552';
    const options = {
      autoConfig: true,
      debug: false,
    };
    ReactPixel.init(pixelId, null, options);
    ReactPixel.pageView(); // first page view
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<RootApp />);
