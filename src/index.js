import geojs from 'geojs';

import content from './index.pug';

document.write(content());

const map = geojs.map({
  node: '#map'
});
map.createLayer('osm');

const layer = map.createLayer('feature', {
  features: ['point']
});

const points = layer.createFeature('point', {
  primitiveShape: 'sprite'
});

points.data([{
  y: 41.8781,
  x: -87.6298
}]);

points.style({
  radius: (d, i) => {
    console.log(d, i);
    return 50;
  }
});
points.draw();
