import { RouteFormat } from '../../server/types';
import { API_URL } from '../../constants';

export function createRouteUrl(
  distance: number,
  routeType: number,
  r: number,
  location: string,
  flipped = false,
  format?: RouteFormat,
): string {
  return [
    `${API_URL}/route?`,
    `distance=${distance}`,
    `routeType=${routeType}`,
    `r=${r}`,
    `location=${location}`,
    flipped ? 'flipped=true' : undefined,
    format ? `format=${format}` : undefined,
  ].join('&');
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 1000);
}
