import { Loadable } from 'recoil';

export function isLoading<T>(i: Loadable<T>): boolean {
  return i.state === 'loading';
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 1000);
}
