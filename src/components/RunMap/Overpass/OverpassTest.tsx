import React, { useEffect, useState } from 'react';
import { Marker, Polyline } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import { useTheme } from '@material-ui/core';

import { Course, OSMData, Segment } from '../../../server/types';

import { API_URL } from '../../../constants';
import junctionUrl from './Junction.png';
import nodeUrl from './Node.png';

function fetchOverpass(): Promise<{ data: OSMData; courses: Course[] }> {
  return fetch(`${API_URL}/overpass`)
    .then((res) => res.json() as Promise<{ data: OSMData; courses: Course[] }>);
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
  const [courses, setCourses] = useState<Course[]>();
  const theme = useTheme();

  const [selectedNode, setSelectedNode] = useState<number>();
  const [selectedSegment, setSelectedSegment] = useState<number>();
  const [selectedCourse, setSelectedCourse] = useState<number>(0);

  useEffect(() => {
    fetchOverpass().then((response) => {
      setOsmData(response.data);
      setCourses(response.courses);
    });
  }, []);

  if (!osmData) {
    return null;
  }

  const selectedSegmentNodes = selectedSegment ? osmData.segments[selectedSegment].nodeRefs : [];
  const selectedNodeSegments = selectedNode ? osmData.nodes[selectedNode].segmentRefs : [];
  const selectedCourseSegments = selectedCourse !== undefined && courses
    ? courses[selectedCourse].segments : [];

  return (
    <>
      {courses && courses.length > 0 && (
        <div
          style={{
            background: 'white',
            padding: 5,
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <div>
            Courses (
            {courses.length}
            )
          </div>
          <div>
            Selected:
            {' '}
            {selectedCourse}
            {' '}
            (
            {courses[selectedCourse].distance.toFixed(2)}
            m)
          </div>
          <button type="button" onClick={(): void => setSelectedCourse(selectedCourse === 0 ? courses?.length - 1 : selectedCourse - 1)}>Previous</button>
          <button type="button" onClick={(): void => setSelectedCourse(selectedCourse === courses?.length - 1 ? 0 : selectedCourse + 1)}>Next</button>
          {/* {courses.map((course, index) => ( */}
          {/*  <button */}
          {/*    style={{ background: index === selectedCourse ? 'blue' : 'initial' }} */}
          {/*    type="button" */}
          {/*    key={course.id} */}
          {/*    onClick={(): void => setSelectedCourse(index)} */}
          {/*  > */}
          {/*    {index} */}
          {/*    : */}
          {/*    ( */}
          {/*    {course.distance.toFixed(2)} */}
          {/*    m) */}
          {/*  </button> */}
          {/* ))} */}
        </div>
      )}
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
          color={selectedCourseSegments.includes(segment.id)
            ? theme.palette.secondary.main
            : theme.palette.primary.main}
          opacity={
            selectedSegment === segment.id
            || selectedNodeSegments.includes(segment.id)
            || selectedCourseSegments.includes(segment.id)
              ? 1 : 0.4
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
