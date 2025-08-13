/**
 * Constructs a page title by combining the site title with an optional page title.
 * Handles cases where the page title is undefined, null, empty, or the same as the site title.
 * 
 * @param siteTitle - The main site title (e.g., "Shipyard")
 * @param pageTitle - The optional page-specific title
 * @returns The constructed title string
 */
export function constructPageTitle(siteTitle: string, pageTitle?: string | null): string {
  // Handle undefined, null, or empty string
  if (!pageTitle) {
    return siteTitle;
  }
  
  // Trim whitespace for comparison and usage
  const trimmedPageTitle = pageTitle.trim();
  
  // Handle empty string after trimming or when page title equals site title
  if (!trimmedPageTitle || trimmedPageTitle === siteTitle) {
    return siteTitle;
  }
  
  return `${siteTitle} - ${trimmedPageTitle}`;
}