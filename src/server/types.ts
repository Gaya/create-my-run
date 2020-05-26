type LatLong = [number, number];

export interface GeometryLineString {
  type: 'LineString',
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
  segments: GeometryLineString[];
}
