import React from 'react';
import { InputLabel, MenuItem, Select } from '@material-ui/core';

interface RouteTypeProps {
  routeType: RouteType['id'];
  setRouteType(newRouteType: RouteType['id']): void;
  routeTypes: RouteType[];
}

const RouteType: React.FC<RouteTypeProps> = ({
  routeType,
  routeTypes,
  setRouteType,
}) => {
  return (
    <>
      <InputLabel shrink id="route-type-label">
        Route type
      </InputLabel>
      <Select
        fullWidth
        labelId="route-type-label"
        id="route-type"
        value={routeType}
        onChange={(event) => setRouteType(event.target.value as number)}
      >
        {routeTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
        ))}
      </Select>
    </>
  );
};

export default RouteType;
