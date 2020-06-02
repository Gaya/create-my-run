import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { routeDataQuery, routeDistanceState, routeTypeState } from '../../atoms/route';
import Distance from './Distance';
import { isLoading } from '../../atoms/utils';
import RouteType from './RouteType';
import StartingPoint from './StartingPoint';

const routeTypes: RouteType[] = [
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
    name: 'Avoid cars',
  }
];

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
}

const Configure: React.FC<ConfigureProps> = ({
  isDrawerOpen,
  onCloseDrawer,
}) => {
  const route = useRecoilValueLoadable(routeDataQuery);

  const setDistanceState = useSetRecoilState(routeDistanceState);
  const [distance, setDistance] = useState<number>(10);

  const setRouteTypeState = useSetRecoilState(routeTypeState);
  const [routeType, setRouteType] = useState<RouteType['id']>(routeTypes[0].id);

  const classes = useStyles();

  const isGenerating = isLoading(route);

  const onGenerateRun = () => {
    if (isGenerating) return;

    setDistanceState(distance);
    setRouteTypeState(routeType);
  };

  useEffect(() => {
    if (!isGenerating && route.contents) {
      onCloseDrawer();
    }
  }, [isGenerating, route.contents, onCloseDrawer]);

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={onCloseDrawer}
    >
      <Box width={400}>
        <Box margin={3}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Configure Run
          </Typography>
        </Box>

        <Box margin={3}>
          <Distance distance={distance} setDistance={setDistance} />
        </Box>

        <Box margin={3}>
          <StartingPoint />
        </Box>

        <Box margin={3}>
          <RouteType
            routeType={routeType}
            routeTypes={routeTypes}
            setRouteType={setRouteType}
          />
        </Box>

      </Box>

      <Box margin={3} display="flex">
        <div className={classes.wrapper}>
          <Button
            color="primary"
            variant="contained"
            disabled={isGenerating}
            onClick={onGenerateRun}
          >
            Create my Run
          </Button>
          {isGenerating && (
            <CircularProgress
              color="secondary"
              size={24}
              className={classes.buttonProgress}
            />
          )}
        </div>
      </Box>
    </Drawer>
  );
}

export default Configure;
