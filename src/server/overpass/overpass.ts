import fs from 'fs';
import fetch from 'node-fetch';
import querystring from 'querystring';
import libxml from 'libxmljs';

import {
  OSMData,
  Way,
  Tags,
  Node,
  LatLng,
  Segment,
} from '../types';

function findTagsInElement(element: libxml.Element): Tags {
  return element
    .find('tag')
    .map((tag) => {
      const t = tag as libxml.Element;

      return {
        k: t.attr('k')?.value() || '',
        v: t.attr('v')?.value(),
      };
    })
    .reduce((acc, tag): Tags => ({ ...acc, [tag.k]: tag.v }), {});
}

function parseOSM(buffer: Buffer): Promise<OSMData> {
  return new Promise((resolve): void => {
    const document = buffer.toString();
    const xmlDoc = libxml.parseXml(document);

    const data: OSMData = {
      nodes: {},
      junctionRefs: [],
      ways: {},
      segments: {},
    };

    xmlDoc
      .find('node')
      .forEach((node): void => {
        const id = parseInt(node.attr('id')?.value() || '', 10);
        const lat = parseFloat(node.attr('lat')?.value() || '0');
        const lon = parseFloat(node.attr('lon')?.value() || '0');
        const tags = findTagsInElement(node);

        data.nodes[id] = {
          id,
          lat,
          lon,
          tags,
          wayRefs: [],
          segmentRefs: [],
        };
      });

    xmlDoc
      .find('way')
      .forEach((way): void => {
        const id = parseInt(way.attr('id')?.value() || '', 10);
        const tags = findTagsInElement(way);

        const nodeRefs = way
          .find('nd')
          .map((nd) => parseInt((nd as libxml.Element).attr('ref')?.value() || '0', 10))
          .filter((ref) => ref !== 0);

        // add ref to way in node
        nodeRefs.forEach((n) => data.nodes[n].wayRefs.push(id));

        data.ways[id] = {
          id,
          tags,
          nodeRefs,
        };
      });

    // create segments
    let segmentId = 1;
    Object.values(data.ways).forEach((way: Way) => {
      let inSegment: number[] = [];
      way.nodeRefs.forEach((n, index) => {
        inSegment.push(n);

        // first node
        if (index === 0) {
          return;
        }

        const node = getNode(data, n);
        const isJunction = node.wayRefs.length > 1;

        if (isJunction) {
          data.junctionRefs.push(node.id);

          data.segments[segmentId] = {
            id: segmentId,
            way: way.id,
            nodeRefs: [...inSegment],
          };

          // add segment ref to nodes in segment
          inSegment.forEach((nd) => getNode(data, nd).segmentRefs.push(segmentId));

          // reset temp segment holders
          inSegment = [n];
          segmentId += 1;
        }
      });
    });

    // determine junctions
    data.junctionRefs = Object.values(data.nodes)
      .filter((node) => node.segmentRefs.length > 1)
      .map((node) => node.id);

    resolve(data);
  });
}

/*
way["bicycle"!~"no"]["bicycle"!~"use_sidepath"]["highway"]
  (around: 1000, 51.455920, 5.785393);
(._;>;);
out;
 */

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLon([lat1, lon1]: LatLng, [lat2, lon2]: LatLng): number {
  const R = 6371; // Radius of the earth in km
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}

function getWay(data: OSMData, id: number): Way {
  const way = data.ways[id];

  if (!way) {
    throw new Error(`Way ${id} not found`);
  }

  return way;
}

function getSegment(data: OSMData, id: number): Segment {
  const segment = data.segments[id];

  if (!segment) {
    throw new Error(`Segment ${id} not found`);
  }

  return segment;
}

function getNode(data: OSMData, id: number): Node {
  const node = data.nodes[id];

  if (!node) {
    throw new Error(`Node ${id} not found`);
  }

  return node;
}

function distanceByNodes(data: OSMData, nodeRefs: number[]): number {
  return nodeRefs.reduce((acc, current, index, refs) => {
    if (index === refs.length - 1) {
      return acc;
    }

    const node1 = getNode(data, refs[index]);
    const node2 = getNode(data, refs[index + 1]);

    const dist = getDistanceFromLatLon([node1.lat, node1.lon], [node2.lat, node2.lon]);

    return acc + dist;
  }, 0);
}

function wayDistance(data: OSMData, id: number): number {
  const way = getWay(data, id);

  return distanceByNodes(data, way.nodeRefs);
}

function segmentDistance(data: OSMData, id: number): number {
  const segment = getSegment(data, id);

  return distanceByNodes(data, segment.nodeRefs);
}

function findConnectedWays(data: OSMData, id: number): Way[] {
  const way = getWay(data, id);

  if (way.nodeRefs.length < 2) {
    return [];
  }

  return Object.values(data.ways)
    .filter(
      (w: Way): boolean => w.id !== id
        && (w.nodeRefs.some((n) => way.nodeRefs.includes(n))),
    );
}

function findConnectedSegments(data: OSMData, id: number): Segment[] {
  const segment = getSegment(data, id);

  return Object.values(data.segments)
    .filter(
      (s: Segment): boolean => s.id !== id
        && (s.nodeRefs.some((n) => segment.nodeRefs.includes(n))),
    );
}

function fetchOverpass(): Promise<any> {
  const center = [51.455920, 5.785393];

  const query = `
  way["bicycle"!~"no"]["bicycle"!~"use_sidepath"]["highway"]["access"!~"private"]
    (around: 500, ${center.join(',')});
  (._;>;);
  out;
  `;

  let q = new Promise<Buffer>((resolve, reject): void => {
    fs.readFile(`${__dirname}/example.xml`, (err, data): void => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });

  const useApi = false;

  if (useApi) {
    q = fetch(
      'https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: querystring.stringify({ data: query }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then((response) => response.buffer());
  }

  return q.then((buffer) => parseOSM(buffer)).then((data) => {
    return data;

    const id = 56;

    const segment = getSegment(data, id);
    const distance = segmentDistance(data, id);
    const segments = findConnectedSegments(data, id);

    return {
      ...segment, distance, segmentRefs: segments.map((c) => c.id), segments,
    };
  });
}

export default fetchOverpass;
