import express from 'express';
import cors from 'cors';

import fetchRoute from './fetchRoute';
import { RoutesResponse } from './types';

const app = express();
const port = 4000;

app.use(cors({
  origin: /^http:\/\/localhost/
}));

app.get('/route', async (req, res) => {
  const response: RoutesResponse = await fetchRoute();
  res.json(response);
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));

