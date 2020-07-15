export type LatLng = [number, number];

export interface GeometryPoint {
  type: 'Point';
  coordinates: LatLng;
}

export interface GeometryLineString {
  type: 'LineString';
  coordinates: LatLng[];
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
  };
}

export interface RouteResponse {
  time: number;
  length: number;
  coordinates: LatLng[];
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
  };
}

export type LocationResponse = {
  name: string;
  key: string;
  coordinates: LatLng;
}

export interface LocationsResponse {
  locations: LocationResponse[];
}

export enum RouteFormat {
  JSON = 'json',
  GPX = 'gpx',
  GARMIN = 'garmin_gpx',
}

export interface Tags {
  [key: string]: string;
}

export interface Node {
  tags: Tags;
  id: number;
  lat: number;
  lon: number;
}

export interface Way {
  tags: Tags;
  nodeRefs: Node['id'][];
  id: number;
}

export interface Segment {
  id: number;
  way: Way['id'];
  nodes: Node['id'][];
}

export interface Nodes {
  [id: number]: Node;
}

export interface Ways {
  [id: number]: Way;
}

export interface OSMData {
  node: Nodes;
  way: Ways;
}
