export type LatLong = [number, number];

export interface GeometryPoint {
  type: 'Point';
  coordinates: LatLong;
}

export interface GeometryLineString {
  type: 'LineString';
  coordinates: LatLong[];
}

interface ExternalRouteSegmentSectionResponse {
  geometry: GeometryLineString;
}

interface ExternalRouteSegmentResponse {
  segmentsections: ExternalRouteSegmentSectionResponse[];
}

interface ExternalRouteResponse {
  routetime: number;
  routelength: number;
  routesegments: ExternalRouteSegmentResponse[];
}

export interface ExternalRoutesResponse {
  _embedded: {
    routes: ExternalRouteResponse[];
  }
}

export interface RoutesResponse {
  time: number;
  length: number;
  coordinates: LatLong[];
}

interface ExternalLocationResponse {
  geometry: GeometryPoint;
  key: string;
  name: string;
  province: string;
}

export interface ExternalLocationsResponse {
  _embedded: {
    locations: ExternalLocationResponse[];
  }
}

interface LocationResponse {
  name: string;
  key: string;
  coordinates: LatLong;
}

export interface LocationsResponse {
  locations: LocationResponse[];
}
