import geojs from 'geojs';

import content from './index.pug';

document.write(content());

const map = geojs.map({
  node: '#map'
});
map.createLayer('osm');
