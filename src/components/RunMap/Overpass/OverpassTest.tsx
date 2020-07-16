import React, { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import { Icon } from 'leaflet';

import { OSMData } from '../../../server/types';
import { API_URL } from '../../../constants';

import junctionUrl from './Junction.png';
import nodeUrl from './Node.png';

function fetchOverpass(): Promise<OSMData> {
  return fetch(`${API_URL}/overpass`)
    .then((res) => res.json() as Promise<OSMData>);
}

const JunctionIcon = new Icon({
  iconUrl: junctionUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const NodeIcon = new Icon({
  iconUrl: nodeUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const OverpassTest: React.FC = () => {
  const [osmData, setOsmData] = useState<OSMData>();

  useEffect(() => {
    fetchOverpass().then((data) => setOsmData(data));
  }, []);

  if (!osmData) {
    return null;
  }

  return (
    <>
      {osmData.ways[6726392].nodeRefs.map((id) => osmData?.nodes[id]).map((node) => (
        <Marker
          key={node.id}
          icon={NodeIcon}
          title={`Node: ${node.id}`}
          position={[node.lat, node.lon]}
        />
      ))}
    </>
  );
};

export default OverpassTest;
