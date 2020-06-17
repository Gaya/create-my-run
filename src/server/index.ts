import express from 'express';
import cors from 'cors';
import serve from 'serve-static';

import fetchRoute from './fetchRoute';
import fetchLocations from './fetchLocations';
import { RouteFormat } from './types';
import { convertCoordinatesToGPX, convertCoordinatesToGarmin } from './gpx';

const app = express();
const port = process.env.API_PORT || 4000;

app.use(cors(!process.env.ALLOW_EXTERNAL ? {
  origin: /^https:\/\/createmy\.run/,
} : {}));

app.use(serve(`${__dirname}/../../build`));

app.get('/route', (req, res) => {
  const distance = (req.query.distance as string) || '0';
  const routeType = (req.query.routeType as string) || '0';
  const location = (req.query.location as string) || '0';
  const randomSeed = (req.query.r as string) || '0';
  const format = (req.query.format as string) || undefined;

  fetchRoute(
    parseFloat(distance),
    parseInt(routeType, 10),
    location,
    parseInt(randomSeed, 10),
  )
    .then((route) => {
      switch (format) {
        case RouteFormat.GPX: {
          const gpx = Buffer.from(convertCoordinatesToGPX(route.coordinates), 'utf8');

          res.setHeader(
            'Content-disposition',
            `attachment; filename=create-my-run-${+new Date()}.gpx`,
          );
          res.setHeader('Content-Type', 'application/gpx+xml');
          res.setHeader('Content-Length', gpx.length);

          res.end(gpx);
          break;
        }
        case RouteFormat.GARMIN: {
          const gpx = Buffer.from(convertCoordinatesToGarmin(route.coordinates), 'utf8');

          res.end(gpx);
          break;
        }
        default:
        case RouteFormat.JSON:
          res.json(route);
          break;
      }
    })
    .catch((err) => res.end(err.message));
});

app.get('/locations', (req, res) => {
  const q = (req.query.q as string) || '';

  fetchLocations(q)
    .then((location) => res.json(location))
    .catch((err) => res.end(err.message));
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
