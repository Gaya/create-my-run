import express from 'express';
import cors from 'cors';
import serve from 'serve-static';

import fetchRoute from './fetchRoute';
import { fetchLocations } from './fetchLocations';

const app = express();
const port = process.env.API_PORT || 4000;

app.use(cors({
  origin: /^https?:\/\/(localhost|createmy\.run)/
}));

app.use(serve(`${__dirname}/../../build`));

app.get('/route', (req, res) => {
  const distance = (req.query.distance as string) || '0';
  const routeType = (req.query.routeType as string) || '0';
  const location = (req.query.location as string) || '0';
  fetchRoute(parseFloat(distance), parseInt(routeType), location)
    .then((route) => res.json(route))
    .catch((err) => res.end(err.message));
});

app.get('/locations', (req, res) => {
  const q = (req.query.q as string) || '';

  fetchLocations(q)
    .then((location) => res.json(location))
    .catch((err) => res.end(err.message));
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));

