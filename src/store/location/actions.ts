import { LatLng } from '../../server/types';

interface FindLocationByLatLng {
  type: 'LOCATION_FIND_BY_LATLNG';
  payload: LatLng;
}

export function findLocationByLatLng(latLng: LatLng): FindLocationByLatLng {
  return {
    type: 'LOCATION_FIND_BY_LATLNG',
    payload: latLng,
  };
}

interface UpdateSearch {
  type: 'LOCATION_UPDATE_SEARCH';
  payload: string;
}

export function updateSearch(search: string): UpdateSearch {
  return {
    type: 'LOCATION_UPDATE_SEARCH',
    payload: search,
  };
}

export type LocationActions = FindLocationByLatLng | UpdateSearch;
