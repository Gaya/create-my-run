import React from 'react';
import {
  Container,
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
    marginBottom: theme.spacing(3),
  },
}));

const SideBarPage: React.FC<SideBarPageProps> = ({ title, onClose, children }) => {
  const classes = useStyles();

  return (
    <Container className={classes.sidebarWrapper} maxWidth="xs">
      <Grid className={classes.closeWrapper} container justify="space-between" xs={12}>
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
      {children}
    </Container>
  );
};

export default SideBarPage;
