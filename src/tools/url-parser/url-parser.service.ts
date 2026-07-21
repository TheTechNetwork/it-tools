export { getUrlSearchParamsEntries, parseUrl };

function parseUrl(urlToParse: string): URL {
  return new URL(urlToParse);
}

function getUrlSearchParamsEntries(url: URL | undefined): [string, string][] {
  return Object.entries(Object.fromEntries(url?.searchParams.entries() ?? []));
}
