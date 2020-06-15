import { BaseBuilder, buildGPX } from 'gpx-builder';

import { LatLng } from './types';

const { Point } = BaseBuilder.MODELS;

function convertCoordinatesToGPX(coordinates: LatLng[]): string {
  const points = coordinates.map(([lat, lng]) => new Point(lat, lng));

  const gpxData = new BaseBuilder();
  gpxData.setSegmentPoints(points);

  return buildGPX(gpxData.toObject());
}

export default convertCoordinatesToGPX;
