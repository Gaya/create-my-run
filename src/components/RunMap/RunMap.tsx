import React, { useEffect, useState } from 'react';
import {
  Map,
  Polyline,
  TileLayer,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { LatLong } from '../../server/types';

import './RunMap.css';
import { useRecoilValueLoadable } from 'recoil';
import { routeDataQuery } from '../../atoms/route';

const RunMap: React.FC = () => {
  const route = useRecoilValueLoadable(routeDataQuery);
  const [coordinates, setCoordinates] = useState<LatLong[]>([]);

  const defaultCenter: LatLong = [51.455820, 5.785390];


  useEffect(() => {
    if (route.state === 'hasValue' && route.contents) {
      setCoordinates(route.contents.coordinates);
    }
  }, [route.state, route.contents]);

  const center = coordinates.length > 0 ? coordinates[0] : defaultCenter;
  const bounds = coordinates.length > 0 ? coordinates : undefined;

  return (
    <Map center={center} bounds={bounds} zoom={14} useFlyTo>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route && <Polyline color="blue" positions={coordinates} />}
    </Map>
  );
};

export default RunMap;
