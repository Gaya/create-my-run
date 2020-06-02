import { Loadable } from 'recoil';

export function isLoading<T>(i: Loadable<T>): boolean {
  return i.state === 'loading';
}
