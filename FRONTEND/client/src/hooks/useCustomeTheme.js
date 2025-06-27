// src/hooks/useCustomTheme.js
import { useTheme } from '@mui/material';

/**
 * Custom hook to access and destructure custom theme palette variables.
 * @returns {object} An object containing all custom theme color variables.
 */
export const useCustomTheme = () => {
  const theme = useTheme();

  // Guard against missing custom palette
  if (!theme.palette.custom) {
    console.error("Custom palette not found in theme. Make sure ThemeContextProvider is configured correctly.");
    // Return a fallback or throw an error depending on your needs.
    // Returning an empty object prevents runtime errors in consuming components.
    return {};
  }

  // Destructure from the custom palette and its nested objects
  const { box, color, text, border, boxShadow } = theme.palette.custom;

  // Destructure and alias the properties to match your variable names
  const outerBox = box?.outer;
  const innerBox = box?.inner;
  const middleBox = box?.middle;
  const primaryColor = color?.primary;
  const specialColor = color?.special;
  const secondaryColor = color?.secondary;
  const whiteColor = color?.white;
  const blackColor = color?.black;
  const specialText = text?.special;
  const secondaryText = text?.secondary;
  const primaryText = text?.primary;
  const whiteBorder = border?.white;
  const blackBorder = border?.black;
  const specialBorder = border?.special;
  const softBoxShadow = boxShadow?.soft;
  

  // Return the combined object of all variables
  return {
    outerBox,
    innerBox,
    middleBox,
    primaryColor,
    specialColor,
    secondaryColor,
    whiteColor,
    blackColor,
    specialText,
    secondaryText,
    primaryText,
    whiteBorder,
    blackBorder,
    specialBorder,
    softBoxShadow,
  };
};