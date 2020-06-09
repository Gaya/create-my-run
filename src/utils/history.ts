import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export function setQueryParameters(params: { [key: string]: string | number }): void {
  const qs = Object.keys(params).sort().map((k): string => [k, params[k]].join('=')).join('&');
  history.push(`/?${qs}`);
}
