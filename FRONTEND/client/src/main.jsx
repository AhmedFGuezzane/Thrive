import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeContextProvider } from './contexts/ThemeContext2'; // Import the ThemeContextProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap your App component with the ThemeContextProvider */}
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </StrictMode>,
)