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

export type AppActions = UpdateDistanceSettings;
