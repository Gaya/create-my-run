import { atom } from 'recoil';

export const drawerOpenState = atom<boolean>({
  key: 'DrawerOpenState',
  default: true,
});
