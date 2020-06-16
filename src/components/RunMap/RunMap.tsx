import React, { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import {
  Map,
  Marker,
  Polyline,
  TileLayer,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import iconUrl from './Marker.png';

import 'leaflet/dist/leaflet.css';

import { routeDataQuery } from '../../state/route';
import { locationByRouteLocation } from '../../state/location';
import { LatLng } from '../../server/types';

import './RunMap.css';
import { safeStoredLocation, storeLocation } from '../../state/utils';

const MarkerIcon = new Icon({
  iconUrl,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

const RunMap: React.FC = () => {
  const route = useRecoilValueLoadable(routeDataQuery);
  const startLocation = useRecoilValueLoadable(locationByRouteLocation);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);

  const defaultCenter: LatLng = safeStoredLocation()?.coordinates || [52.132633, 5.291266];

  useEffect(() => {
    if (route.state === 'hasValue' && route.contents) {
      setCoordinates(route.contents.coordinates);
    }
  }, [route.state, route.contents]);

  useEffect(() => {
    if (startLocation.state === 'hasValue' && startLocation.contents) {
      storeLocation(startLocation.contents);
    }
  }, [startLocation.contents, startLocation.state]);

  const center = coordinates.length > 0 ? coordinates[0] : defaultCenter;
  const bounds = coordinates.length > 0 ? coordinates : undefined;

  return (
    <Map center={center} bounds={bounds} zoom={13} useFlyTo>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {startLocation.state === 'hasValue'
        && startLocation.contents?.coordinates
        && (
          <Marker
            position={startLocation.contents?.coordinates}
            icon={MarkerIcon}
            title="Starting Point"
            alt="Starting Point"
          />
        )}
      {route && <Polyline color="blue" opacity={0.5} positions={coordinates} />}
    </Map>
  );
};

export default RunMap;
