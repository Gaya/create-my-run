import React from 'react';
import {
  Map,
  Marker,
  TileLayer,
} from 'react-leaflet';
import { DragEndEvent, Icon, LeafletMouseEvent } from 'leaflet';
import { useTheme } from '@material-ui/core';
import Polyline from 'react-leaflet-arrowheads';
import { useDispatch, useSelector } from 'react-redux';

import 'leaflet/dist/leaflet.css';

import { LatLng } from '../../server/types';
import { safeStoredLocation } from '../../utils/localStorage';
import { flippedSelector, locationSelector, routeSelector } from '../../store/route/selectors';

import iconUrl from './Marker.png';

import './RunMap.css';
import { findLocationByLatLng } from '../../store/location/actions';
import { locationByKeySelector } from '../../store/location/selectors';

const MarkerIcon = new Icon({
  iconUrl,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

const RunMap: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const route = useSelector(routeSelector);
  const location = useSelector(locationSelector);
  const flipped = useSelector(flippedSelector);

  const startLocation = useSelector(locationByKeySelector(location));

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
    dispatch(findLocationByLatLng([latlng.lat, latlng.lng]));
  };

  const onDragend = (e: DragEndEvent): void => {
    const latLng = e.target.getLatLng();
    dispatch(findLocationByLatLng(latLng));
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
      {startLocation
        && (
          <Marker
            position={startLocation.coordinates}
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
