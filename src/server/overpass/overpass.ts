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
      node: {},
      way: {},
    };

    xmlDoc
      .find('node')
      .forEach((node): void => {
        const id = node.attr('id')?.value() || '';
        const lat = parseFloat(node.attr('lat')?.value() || '0');
        const lon = parseFloat(node.attr('lon')?.value() || '0');
        const tags = findTagsInElement(node);

        data.node[id] = {
          id,
          lat,
          lon,
          tags,
        };
      });

    xmlDoc
      .find('way')
      .forEach((way): void => {
        const id = way.attr('id')?.value() || '';
        const tags = findTagsInElement(way);

        const nodeRefs = way
          .find('nd')
          .map((nd) => (nd as libxml.Element).attr('ref')?.value() || '')
          .filter((ref) => ref !== '');

        data.way[id] = {
          id,
          tags,
          nodeRefs,
        };
      });

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

function getWay(data: OSMData, id: string): Way {
  const way = data.way[id];

  if (!way) {
    throw new Error(`Way ${id} not found`);
  }

  return way;
}

function getNode(data: OSMData, id: string): Node {
  const node = data.node[id];

  if (!node) {
    throw new Error(`Node ${id} not found`);
  }

  return node;
}

function wayDistance(data: OSMData, id: string): number {
  const way = getWay(data, id);

  return way.nodeRefs.reduce((acc, current, index, refs) => {
    if (index === refs.length - 1) {
      return acc;
    }

    const node1 = getNode(data, refs[index]);
    const node2 = getNode(data, refs[index + 1]);

    const dist = getDistanceFromLatLon([node1.lat, node1.lon], [node2.lat, node2.lon]);

    return acc + dist;
  }, 0);
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

  if (process.env.NODE_ENV === 'production') {
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
    const distance = wayDistance(data, '446266327');

    return { distance };
  });
}

export default fetchOverpass;
