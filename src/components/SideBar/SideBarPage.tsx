import React from 'react';
import {
  Container, Divider,
  Grid,
  IconButton,
  Theme, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

interface SideBarPageProps {
  title: string;
  onClose(): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  sidebarWrapper: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  closeWrapper: {
    flexGrow: 0,
    flexBasis: 0,
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
}));

const SideBarPage: React.FC<SideBarPageProps> = ({ title, onClose, children }) => {
  const classes = useStyles();

  return (
    <Container className={classes.sidebarWrapper} maxWidth="xs">
      <Grid className={classes.closeWrapper} container item justify="space-between">
        <Grid item>
          <Typography variant="h6">
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item className={classes.divider}>
        <Divider />
      </Grid>
      {children}
    </Container>
  );
};

export default SideBarPage;
