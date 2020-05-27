import React from 'react';
import {
  Map,
  Polyline,
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
  const coordinates = route?.coordinates || [];

  const center = coordinates.length > 0 ? coordinates[0] : defaultCenter;
  const bounds = coordinates.length > 0 ? coordinates : undefined;

  return (
    <Map center={center} bounds={bounds} zoom={13} useFlyTo>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline color="blue" positions={coordinates} />
    </Map>
  );
};

export default RunMap;
