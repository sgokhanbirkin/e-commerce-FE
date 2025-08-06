/**
 * Utility function to handle image URLs
 * Backend now returns full imageUrl, so we can use them directly
 */

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return '';
  }

  // Backend now returns full URLs, so return as is
  return imagePath;
};
