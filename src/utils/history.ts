import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export function setQueryParameters(params: { [key: string]: string | number | boolean }): void {
  const qs = Object.keys(params)
    .sort()
    .filter((k) => (typeof params[k] === 'boolean' ? !!params[k] : true))
    .map((k): string => [k, params[k]].join('='))
    .join('&');
  history.push(`/?${qs}`);
}
