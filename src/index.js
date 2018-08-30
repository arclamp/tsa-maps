import geo from 'geojs';

import content from './index.pug';
import data from './data.json';

function extractPoints (data) {
  let result = [];
  Object.keys(data).forEach(k => {
    result.push({
      x: data[k].airport.lon,
      y: data[k].airport.lat,
      name: data[k].airport['Airport Name'],
      code: data[k].airport['Airport Code'],
      total: data[k].total
    });
  });

  return result;
}

document.write(content());

const map = geo.map({
  node: '#map'
});
map.createLayer('osm');

const layer = map.createLayer('feature', {
  features: ['point']
});

const points = layer.createFeature('point', {
  primitiveShape: 'sprite',
  selectionAPI: true
});

const pointData = extractPoints(data);
console.log(pointData);

points.style({
  radius: (d, i) => {
    const val = 5 + Math.sqrt(d.total);
    return val;
  }
});

points.data(pointData);

points.geoOn(geo.event.feature.mouseclick, evt => {
  console.log(evt);
});

points.draw();
