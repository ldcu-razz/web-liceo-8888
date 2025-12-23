export const getRoute = (route: string, params: Record<string, string>) => {
  return route.replace(/{(\w+)}/g, (match, key) => params[key] || match);
};

export const getRouteWithParams = (route: string, params: Record<string, string>) => {
  return route.replace(/{(\w+)}/g, (match, key) => params[key] || match);
};

export const getRouteWithQuery = (route: string, query: Record<string, string>) => {
  return route.replace(/{(\w+)}/g, (match, key) => query[key] || match);
};

export const getRouteWithQueryParams = (route: string, query: Record<string, string>, params: Record<string, string>) => {
  return route.replace(/{(\w+)}/g, (match, key) => query[key] || params[key] || match);
};