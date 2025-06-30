
import { useTheme } from '@mui/material';

export const useCustomTheme = () => {
  const theme = useTheme();

  if (!theme.palette.custom) {
    console.error("Custom palette not found in theme. Make sure ThemeContextProvider is configured correctly.");
    return {};
  }

  const { box, color, text, border, boxShadow } = theme.palette.custom;

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