import React, { useEffect, useState } from 'react';
import { Marker, Polyline } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import { useTheme } from '@material-ui/core';

import { OSMData } from '../../../server/types';

import { API_URL } from '../../../constants';
import junctionUrl from './Junction.png';
import nodeUrl from './Node.png';

function fetchOverpass(): Promise<OSMData> {
  return fetch(`${API_URL}/overpass`)
    .then((res) => res.json() as Promise<{ data: OSMData }>)
    .then((res) => res.data);
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
  const theme = useTheme();

  const [selectedNode, setSelectedNode] = useState<number>();
  const [selectedSegment, setSelectedSegment] = useState<number>();

  useEffect(() => {
    fetchOverpass().then((data) => setOsmData(data));
  }, []);

  if (!osmData) {
    return null;
  }

  const selectedSegmentNodes = selectedSegment ? osmData.segments[selectedSegment].nodeRefs : [];
  const selectedNodeSegments = selectedNode ? osmData.nodes[selectedNode].segmentRefs : [];

  return (
    <>
      {osmData.junctionRefs.map((id) => osmData?.nodes[id]).map((node) => (
        <Marker
          key={node.id}
          icon={JunctionIcon}
          title={`Node: ${node.id}`}
          position={[node.lat, node.lon]}
          opacity={selectedNode === node.id || selectedSegmentNodes.includes(node.id) ? 1 : 0.4}
          onclick={(e: LeafletMouseEvent): void => {
            e.originalEvent.preventDefault();
            setSelectedNode(node.id);
            setSelectedSegment(undefined);
          }}
        />
      ))}
      {Object.values(osmData.segments).map((segment) => (
        <Polyline
          key={segment.id}
          color={theme.palette.primary.main}
          opacity={
            selectedSegment === segment.id || selectedNodeSegments.includes(segment.id) ? 1 : 0.4
          }
          positions={
            segment.nodeRefs.map((n: number) => [osmData.nodes[n].lat, osmData.nodes[n].lon])
          }
          title={`Segment: ${segment.id}`}
          smoothFactor={5}
          onclick={(e: LeafletMouseEvent): void => {
            e.originalEvent.preventDefault();
            setSelectedNode(undefined);
            setSelectedSegment(segment.id);
          }}
        />
      ))}

    </>
  );
};

export default OverpassTest;
