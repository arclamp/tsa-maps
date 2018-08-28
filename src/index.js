import geo from 'geojs';

import content from './index.pug';

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

points.data([{
  y: 41.8781,
  x: -87.6298
}]);

points.style({
  radius: (d, i) => {
    return 50;
  }
});
points.draw();

points.geoOn(geo.event.feature.mouseclick, evt => {
  console.log(evt);
});
