import React from 'react';
import { InputLabel, MenuItem, Select } from '@material-ui/core';

import { RouteTypeValue } from '../../types';

interface RouteTypeProps {
  routeType: RouteTypeValue['id'];
  setRouteType(newRouteType: RouteTypeValue['id']): void;
  routeTypes: RouteTypeValue[];
}

const RouteType: React.FC<RouteTypeProps> = ({
  routeType,
  routeTypes,
  setRouteType,
}) => (
  <>
    <InputLabel shrink id="route-type-label">
      Route type
    </InputLabel>
    <Select
      fullWidth
      labelId="route-type-label"
      id="route-type"
      value={routeType}
      onChange={(event): void => setRouteType(event.target.value as number)}
    >
      {routeTypes.map((type) => (
        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
      ))}
    </Select>
  </>
);

export default RouteType;
