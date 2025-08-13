export const getTitle = (
  siteTitle: string,
  pageTitle?: string | null,
): string => {
  if (!pageTitle) return siteTitle

  const trimmedPageTitle = pageTitle.trim()
  if (!trimmedPageTitle || trimmedPageTitle === siteTitle) return siteTitle

  return `${siteTitle} - ${trimmedPageTitle}`
}
