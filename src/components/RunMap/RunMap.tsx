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
  if (!route) {
    return <div>Loading route...</div>;
  }

  const center = route.segments[0].coordinates[0];
  const bounds = route.segments.reduce((acc: LatLong[], s) => [...acc, ...s.coordinates], []);

  return (
    <Map center={center} bounds={bounds} zoom={13} useFlyTo>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route.segments.map((s) => (
        <Polyline color="blue" key={s.index} positions={s.coordinates} />
      ))}
    </Map>
  );
};

export default RunMap;
