export interface UpdateDistanceSettingsPayload {
  defaultDistance?: number;
  minimumDistance?: number;
  maximumDistance?: number;
}

interface UpdateDistanceSettings {
  type: 'APP_UPDATE_DISTANCE_SETTINGS';
  payload: UpdateDistanceSettingsPayload;
}

export function updateDistanceSettings(
  payload: UpdateDistanceSettingsPayload,
): UpdateDistanceSettings {
  return {
    type: 'APP_UPDATE_DISTANCE_SETTINGS',
    payload,
  };
}

interface OpenDrawer {
  type: 'APP_OPEN_DRAWER';
}

export function openDrawer(): OpenDrawer {
  return {
    type: 'APP_OPEN_DRAWER',
  };
}

interface CloseDrawer {
  type: 'APP_CLOSE_DRAWER';
}

export function closeDrawer(): CloseDrawer {
  return {
    type: 'APP_CLOSE_DRAWER',
  };
}

export type AppActions = UpdateDistanceSettings | OpenDrawer | CloseDrawer;
