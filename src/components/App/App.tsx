import React, { useState } from 'react';

import { RoutesResponse } from '../../server/types';

import RunMap from '../RunMap/RunMap';

import './App.css';
import {
  AppBar,
  Box, Button, CircularProgress,
  Drawer,
  InputLabel,
  MenuItem,
  Select,
  Slider, Toolbar, Typography,
} from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

function valuetext(value: number): string {
  return `${value} km`;
}

const routeTypes = [
  {
    id: 69,
    name: 'Recreative',
  },
  {
    id: 65,
    name: 'Nature',
  },
  {
    id: 66,
    name: 'Car-free',
  }
];

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const App: React.FC = () => {
  const [routeData, setRouteData] = useState<RoutesResponse>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [distance, setDistance] = useState<number>(10);
  const [routeType, setRouteType] = useState<number>(routeTypes[0].id);

  const classes = useStyles();

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const generateRun = () => {
    if (fetching) return;

    const url = 'http://localhost:4000';

    setFetching(true);

    fetch(`${url}/route?distance=${distance}&routeType=${routeType}`)
      .then((res) => res.json() as Promise<RoutesResponse>)
      .then((route) => {
        setFetching(false);
        setRouteData(route);
        closeDrawer();
      })
      .catch(console.error);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Box marginRight={2}>
              <Button onClick={openDrawer} color="inherit">Change Run</Button>
            </Box>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Generate a Run
            </Typography>
            {routeData && (
              <Typography variant="h6">
                {(routeData.length / 1000).toFixed(2)} km
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={drawerOpen} onClose={closeDrawer}>
          <Box width={300}>
            <Box margin={3}>
              <InputLabel id="distance-slider" shrink>
                Distance
              </InputLabel>
              <Slider
                min={0}
                max={50}
                value={distance}
                onChange={(event, value) => setDistance(Array.isArray(value) ? value[0] : value)}
                getAriaValueText={valuetext}
                aria-labelledby="distance-slider"
                step={0.5}
                marks={[5, 10, 15, 21.1, 42.2, 50].map(v => ({ value: v, label: v }))}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box margin={3}>
              <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                Route type
              </InputLabel>
              <Select
                fullWidth
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={routeType}
                onChange={(event) => setRouteType(event.target.value as number)}
              >
                {routeTypes.map((rt) => (
                  <MenuItem key={rt.id} value={rt.id}>{rt.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Box margin={3} display="flex">
            <div className={classes.wrapper}>
              <Button variant="contained" disabled={fetching} onClick={generateRun}>Generate Run</Button>
              {fetching && <CircularProgress color="secondary" size={24} className={classes.buttonProgress} />}
            </div>
          </Box>
        </Drawer>
        <RunMap route={routeData} />
      </div>
    </ThemeProvider>
  );
}

export default App;
