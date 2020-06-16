import React from 'react';
import { Link, Typography } from '@material-ui/core';

const About: React.FC = () => (
  <>
    <Typography paragraph>
      Create My Run is a just for fun project created out of love for running by
      {' '}
      <Link href="https://theclevernode.com">Gaya Kessler</Link>
      .
    </Typography>
    <Typography paragraph>
      The purpose of this little application is to find new routes to run, no matter how experienced
      you are.
    </Typography>
    <Typography paragraph>
      Set a starting point, pick a distance, and find your next route to run.
    </Typography>
    <Typography paragraph>
      Routes can be exported to GPX to be loaded on navigational devices such as smart watches or
      running watches.
    </Typography>
    <Typography paragraph>
      This project is completely
      {' '}
      <Link href="https://github.com/Gaya/create-my-run">open source</Link>
      . Feel free to contribute in any form.
    </Typography>
  </>
);

export default About;
