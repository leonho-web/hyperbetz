import { oklch, Color, formatCss } from "culori";

/**
 * Calculates a high-contrast foreground color based on the lightness of a background color.
 *
 * @param backgroundColor - The background color object from the `culori` library.
 * @returns An Oklch string for a high-contrast foreground (either near-white or near-black).
 */
const getContrastingForegroundColor = (backgroundColor: Color): string => {
  // Oklch lightness (`l`) ranges from 0 (black) to 1 (white).
  // 0.6 is a good threshold for switching between light and dark text.
  const oklchColor = oklch(backgroundColor);
  if (oklchColor.l > 0.6) {
    // If the background is light, use a dark foreground.
    return "oklch(0.1 0 0)"; // A very dark, near-black color
  } else {
    // If the background is dark, use a light foreground.
    return "oklch(0.98 0 0)"; // A very light, near-white color
  }
};

/**
 * Temporarily applies a custom background and a calculated high-contrast foreground color
 * to the document's root element. These are inline styles that override the stylesheet.
 *
 * @param colorStr - The new background color in any valid CSS format (hex, rgb, etc.).
 */
export const applyCustomBackgroundColor = (colorStr: string) => {
  try {
    // 1. Parse the input color string and convert it to the Oklch color space.
    const newBgColor = oklch(colorStr);
    if (!newBgColor) return;

    // 2. Calculate the best contrasting foreground color.
    const newFgColor = getContrastingForegroundColor(newBgColor);

    // 3. Convert the parsed background color back to a CSS string.
    const newBgColorStr = formatCss(newBgColor);

    // 4. Get the root `<html>` element's style property.
    const rootStyle = document.documentElement.style;

    // 5. Set the inline styles. These will override the variables from globals.css.
    rootStyle.setProperty("--background", newBgColorStr);
    rootStyle.setProperty("--foreground", newFgColor);
  } catch (error) {
    console.error("Invalid color provided for custom background:", error);
  }
};

/**
 * Removes the temporarily applied custom background and foreground colors,
 * allowing the stylesheet's theme variables to take effect again.
 */
export const clearCustomBackgroundColor = () => {
  const rootStyle = document.documentElement.style;
  rootStyle.removeProperty("--background");
  rootStyle.removeProperty("--foreground");
};
