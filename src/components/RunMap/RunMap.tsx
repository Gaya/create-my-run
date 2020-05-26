import React from 'react';
import {
  Circle,
  CircleMarker,
  Map,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { LatLong, RoutesResponse } from '../../server/types';

import './RunMap.css';

interface RunMapProps {
  route?: RoutesResponse;
}

const RunMap: React.FC<RunMapProps> = ({ route }) => {

  const defaultCenter: LatLong = [51.455820, 5.785390];
  const segments = route?.segments || [];

  const center = segments.length > 0 ? segments[0].coordinates[0] : defaultCenter;
  const bounds = segments.length > 0 ? segments.reduce((acc: LatLong[], s) => [...acc, ...s.coordinates], []) : undefined;

  return (
    <Map center={center} bounds={bounds} zoom={13} useFlyTo>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {segments.map((s) => (
        <Polyline color="blue" key={s.index} positions={s.coordinates} />
      ))}
    </Map>
  );
};

export default RunMap;
