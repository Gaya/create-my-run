import React, { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import {
  Map,
  Marker,
  Polyline,
  TileLayer,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { routeDataQuery } from '../../atoms/route';
import { locationByRouteLocation } from '../../atoms/location';
import { LatLong } from '../../server/types';

import './RunMap.css';

const RunMap: React.FC = () => {
  const route = useRecoilValueLoadable(routeDataQuery);
  const startLocation = useRecoilValueLoadable(locationByRouteLocation);
  const [coordinates, setCoordinates] = useState<LatLong[]>([]);

  const defaultCenter: LatLong = [52.132633, 5.291266];

  useEffect(() => {
    if (route.state === 'hasValue' && route.contents) {
      setCoordinates(route.contents.coordinates);
    }
  }, [route.state, route.contents]);

  const center = coordinates.length > 0 ? coordinates[0] : defaultCenter;
  const bounds = coordinates.length > 0 ? coordinates : undefined;

  return (
    <Map center={center} bounds={bounds} zoom={9} useFlyTo>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {startLocation.state === 'hasValue'
        && startLocation.contents?.coordinates
        && <Marker position={startLocation.contents?.coordinates} />}
      {route && <Polyline color="blue" positions={coordinates} />}
    </Map>
  );
};

export default RunMap;
