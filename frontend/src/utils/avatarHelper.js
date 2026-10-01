/**
 * Safely converts raw SVG markup to a Base64-encoded Data URL.
 * Handles Unicode/special characters correctly to avoid issues with window.btoa.
 * 
 * @param {string} svg - Raw SVG string
 * @returns {string} Base64 Data URL for use in <img> src attributes
 */
export const svgToBase64 = (svg) => {
  if (!svg) return '';
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  } catch (error) {
    console.error('Failed to convert SVG to base64:', error);
    return '';
  }
};
