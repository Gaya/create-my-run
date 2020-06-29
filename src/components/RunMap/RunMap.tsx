import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import {
  Map,
  Marker,
  TileLayer,
} from 'react-leaflet';
import { DragEndEvent, Icon, LeafletMouseEvent } from 'leaflet';
import { useTheme } from '@material-ui/core';
import Polyline from 'react-leaflet-arrowheads';
import { useSelector } from 'react-redux';

import 'leaflet/dist/leaflet.css';

import {
  locationByRouteLocation,
  locationSearchState,
} from '../../state/location';
import { LatLng } from '../../server/types';
import { safeStoredLocation, storeLocation } from '../../utils/localStorage';
import { flippedSelector, routeSelector } from '../../store/route/selectors';

import iconUrl from './Marker.png';

import './RunMap.css';

const MarkerIcon = new Icon({
  iconUrl,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

const RunMap: React.FC = () => {
  const theme = useTheme();

  const route = useSelector(routeSelector);
  const flipped = useSelector(flippedSelector);

  const startLocation = useRecoilValueLoadable(locationByRouteLocation);

  const defaultCenter: LatLng = safeStoredLocation()?.coordinates || [52.132633, 5.291266];

  const stateCoordinates = route.state === 'hasValue' ? route.data.coordinates
    : [];
  const coordinates = flipped
    ? [...stateCoordinates].reverse()
    : stateCoordinates;

  // @TODO side effect in middleware
  // useEffect(() => {
  //   if (startLocation.state === 'hasValue' && startLocation.contents) {
  //     storeLocation(startLocation.contents);
  //   }
  // }, [startLocation.contents, startLocation.state]);

  const center = coordinates.length > 0 ? coordinates[0] : defaultCenter;
  const bounds = coordinates.length > 0 ? coordinates : undefined;

  const handleClick = ({ latlng }: LeafletMouseEvent): void => {
    // setLocationSearch([latlng.lat, latlng.lng]);
  };

  const onDragend = (e: DragEndEvent): void => {
    const latLng = e.target.getLatLng();
    // setLocationSearch([latLng.lat, latLng.lng]);
  };

  return (
    <Map
      center={center}
      bounds={bounds}
      zoom={13}
      useFlyTo
      onClick={handleClick}
    >
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
            draggable
            onDragend={onDragend}
          />
        )}
      {route && coordinates.length > 0 && (
        <Polyline
          color={theme.palette.secondary.main}
          opacity={0.7}
          positions={coordinates}
          smoothFactor={5}
          arrowheads={{
            size: '10px',
            frequency: '1000m',
          }}
        />
      )}
    </Map>
  );
};

export default RunMap;
