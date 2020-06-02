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
        {routeTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
        ))}
      </Select>
    </>
  );
};

export default RouteType;
