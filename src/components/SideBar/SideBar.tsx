import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  Grid,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ExploreIcon from '@material-ui/icons/Explore';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';

import Configure from '../Configure/Configure';
import About from '../About/About';
import SideBarPage from './SideBarPage';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  sidebarWrapper: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  closeWrapper: {
    flexGrow: 0,
    flexBasis: 0,
  },
}));

interface SideBarProps {
  isDrawerOpen: boolean;
  onCloseDrawer(): void;
}

const SideBar: React.FC<SideBarProps> = ({ isDrawerOpen, onCloseDrawer }) => {
  const classes = useStyles();
  const [navigationValue, setNavigationValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setNavigationValue(newValue);
  };

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={onCloseDrawer}
    >
      <Grid className={classes.root} container direction="column" justify="space-between">
        <Grid item>
          {navigationValue === 0 && (
            <SideBarPage
              title="Create My Run"
              onClose={onCloseDrawer}
            >
              <Configure onRouteLoaded={onCloseDrawer} />
            </SideBarPage>
          )}
          {navigationValue === 1 && (
            <SideBarPage
              title="Settings"
              onClose={onCloseDrawer}
            >
              Content of settings
            </SideBarPage>
          )}
          {navigationValue === 2 && (
            <SideBarPage
              title="About Create My Run"
              onClose={onCloseDrawer}
            >
              <About />
            </SideBarPage>
          )}
        </Grid>

        <Grid item>
          <BottomNavigation
            value={navigationValue}
            onChange={handleChange}
            showLabels
          >
            <BottomNavigationAction label="Create Run" icon={<ExploreIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
            <BottomNavigationAction label="About" icon={<InfoIcon />} />
          </BottomNavigation>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default SideBar;
