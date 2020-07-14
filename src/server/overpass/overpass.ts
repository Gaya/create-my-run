import fetch from 'node-fetch';
import querystring from 'querystring';
import libxml from 'libxmljs';

import {
  OSMData,
  Way,
  Node,
  Tags,
  Nodes, Ways,
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

    data.node = xmlDoc
      .find('node')
      .map((node): Node => {
        const id = node.attr('id')?.value() || '';
        const lat = parseFloat(node.attr('lat')?.value() || '0');
        const lon = parseFloat(node.attr('lon')?.value() || '0');
        const tags = findTagsInElement(node);

        return {
          id,
          lat,
          lon,
          tags,
        };
      })
      .reduce((acc, node): Nodes => ({ ...acc, [node.id]: node }), {});

    data.way = xmlDoc
      .find('way')
      .map((way): Way => {
        const id = way.attr('id')?.value() || '';
        const tags = findTagsInElement(way);

        const nodeRefs = way
          .find('nd')
          .map((nd) => (nd as libxml.Element).attr('ref')?.value() || '')
          .filter((ref) => ref !== '');

        return {
          id,
          tags,
          nodeRefs,
        };
      })
      .reduce((acc, way): Ways => ({ ...acc, [way.id]: way }), {});

    resolve(data);
  });
}

/*
way["bicycle"!~"no"]["bicycle"!~"use_sidepath"]["highway"]
  (around: 1000, 51.455920, 5.785393);
(._;>;);
out;
 */

function fetchOverpass(): Promise<OSMData> {
  const center = [51.455920, 5.785393];

  const query = `
  way["bicycle"!~"no"]["bicycle"!~"use_sidepath"]["highway"]["access"!~"private"]
    (around: 100, ${center.join(',')});
  (._;>;);
  out;
  `;

  return fetch(
    'https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: querystring.stringify({ data: query }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  )
    .then((response) => response.buffer())
    .then((buffer) => parseOSM(buffer));
}

export default fetchOverpass;
