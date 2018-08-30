import { select } from 'd3-selection';
import geo from 'geojs';
import c3 from 'c3';
import 'c3/c3.css';

import content from './index.pug';
import data from './data.json';

function extractPoints (data) {
  let result = [];
  Object.keys(data).forEach(k => {
    let record = {
      x: data[k].airport.lon,
      y: data[k].airport.lat,
      name: data[k].airport['Airport Name'],
      code: data[k].airport['Airport Code'],
      total: data[k].total,
      data: data[k]
    };

    delete record.data.airport;
    delete record.data.total;

    result.push(record);
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

  makeChart();
});

points.draw();

const ui = map.createLayer('ui');
const legend = ui.createWidget('colorLegend', {
  position: {
    right: 20,
    top: 10
  },
  categories: [{
    name: 'Population',
    type: 'discrete',
    scale: 'linear',
    domain: [500e3, 6e5],
    colors: ['rgb(237,248,233)', 'rgb(186,228,179)', 'rgb(116,196,118)', 'rgb(35,139,69)']
  }]
});

const chartWidget = ui.createWidget('svg');
select(chartWidget.canvas())
  .style('width', '400px')
  .style('height', '400px');

function makeChart ()  {
  select(chartWidget.canvas()).selectAll('*').remove();

  c3.generate({
    bindto: chartWidget.canvas(),
    data: {
      x: 'x',
      columns: [
        ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
        ['data1', 10 * Math.random(), 10 * Math.random(), 10 * Math.random(), 10 * Math.random(), 10 * Math.random(), 10 * Math.random()]
      ]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m'
        }
      }
    }
  });
}
