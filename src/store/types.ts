export interface AppState {
  drawerOpened: boolean;
  defaultDistance: number;
  minimumDistance: number;
  maximumDistance: number;
}

export interface StoreState {
  app: AppState;
}
