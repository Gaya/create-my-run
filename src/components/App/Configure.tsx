import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function distanceValueText(value: number): string {
  return `${value} km`;
}

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

interface ConfigureProps {
  isDrawerOpen: boolean;
  onCloseDrawer(): void;
  distance: number;
  setDistance(distance: number): void;
  routeTypes: RouteType[];
  routeType: RouteType['id'];
  setRouteType(type: RouteType['id']): void;
  isGenerating: boolean;
  onGenerateRun(): void;
}

const Configure: React.FC<ConfigureProps> = ({
  isDrawerOpen,
  onCloseDrawer,
  distance,
  setDistance,
  routeTypes,
  routeType,
  setRouteType,
  isGenerating,
  onGenerateRun,
}) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={onCloseDrawer}
    >
      <Box width={300}>
        <Box margin={3}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Configure Run
          </Typography>
        </Box>
        <Box margin={3}>
          <InputLabel id="distance-slider" shrink>
            Distance
          </InputLabel>
          <Slider
            min={0}
            max={50}
            value={distance}
            onChange={(event, value) => setDistance(Array.isArray(value) ? value[0] : value)}
            getAriaValueText={distanceValueText}
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
          <Button
            color="secondary"
            variant="contained"
            disabled={isGenerating}
            onClick={onGenerateRun}
          >
            Create my Run
          </Button>
          {isGenerating && <CircularProgress color="secondary" size={24} className={classes.buttonProgress} />}
        </div>
      </Box>
    </Drawer>
  );
}

export default Configure;
