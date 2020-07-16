import React, { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';

import { OSMData } from '../../server/types';
import { API_URL } from '../../constants';

function fetchOverpass(): Promise<OSMData> {
  return fetch(`${API_URL}/overpass`)
    .then((res) => res.json() as Promise<OSMData>);
}

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
        <Marker title={`Node: ${node.id}`} position={[node.lat, node.lon]} />
      ))}
    </>
  );
};

export default OverpassTest;
