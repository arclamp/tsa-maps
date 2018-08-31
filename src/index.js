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
  node: '#map',
  center: {
    x: -72.583333,
    y: 49.833333
  }
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

let selected = null;
points.style({
  radius: (d, i) => {
    const val = 5 + Math.sqrt(d.total);
    return val;
  }
});

points.data(pointData);

points.geoOn(geo.event.feature.mouseclick, evt => {
  if (!evt.top) {
    return;
  }

  selected = evt.idx;

  console.log(evt.data);

  makeChart(data[evt.data.code], evt.data.code);
});

points.draw();

const ui = map.createLayer('ui');

const chartWidget = ui.createWidget('svg');
select(chartWidget.canvas())
  .style('width', '600px')
  .style('height', '400px');

function makeChart (series, code)  {
  const g = select(chartWidget.canvas());
  g.selectAll('*')
    .remove();

  let dates = Object.keys(series).sort((a, b) => a < b ? -1 : (a > b ? 1 : 0));

  const approve = dates.map(v => series[v].values['Approve in Full'] || 0);
  const deny = dates.map(v => series[v].values['Deny'] || 0);
  const settle = dates.map(v => series[v].values['Settle'] || 0);
  // const open = dates.map(v => series[v].values['-'] || 0);

  dates = dates.map(d => d.replace(/\//g, '-') + '-01');

  c3.generate({
    bindto: g.node(),
    data: {
      x: 'x',
      columns: [
        ['x', ...dates],
        ['Approve', ...approve],
        ['Deny', ...deny],
        ['Settle', ...settle],
        // ['Open', ...open]
      ]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m',
          rotate: 45
        }
      },
      y: {
        label: {
          text: 'US Dollars',
          position: 'outer-middle'
        }
      }
    }
  });

  g.insert('rect', ':first-child')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 600)
    .attr('height', 400)
    .style('fill', 'white')
    .style('opacity', 0.8);

  g.append('text')
    .attr('x', 300)
    .attr('y', 50)
    .style('text-anchor', 'middle')
    .text(code);
}
