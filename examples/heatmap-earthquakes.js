import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import KML from '../src/ol/format/KML.js';
import {Heatmap as HeatmapLayer, Tile as TileLayer} from '../src/ol/layer.js';
import Stamen from '../src/ol/source/Stamen.js';
import VectorSource from '../src/ol/source/Vector.js';
import {clamp} from '../src/ol/math.js';

const blur = document.getElementById('blur');
const radius = document.getElementById('radius');

const vector = new HeatmapLayer({
  source: new VectorSource({
    //url: 'data/kml/2012_Earthquakes_Mag5.kml',
    //url: '/~yxl/data/org_695.kml',
    url: 'data/kml/uscities_sample.kml',
    format: new KML({
      extractStyles: false
    })
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10)
});

vector.getSource().on('addfeature', function(event) {
  // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
  // standards-violating <magnitude> tag in each Placemark.  We extract it from
  // the Placemark's name instead.
  //const name = event.feature.get('name');
  //const magnitude = parseFloat(name.substr(2));
  //event.feature.set('weight', magnitude - 5);
  // data: bus
  //const puvolt = event.feature.get('PUVolt');
  ////const w = puvolt * 1.0 / (1.39994159 - 0.55512744);
  //const w = (parseFloat(puvolt) - 0.9) * 1.0 / (1.1 - 0.9);
  ////console.log("w = " + w);
  ////return w;
  //event.feature.set('weight', clamp(w, 0, 1));
  // data: popdiff
  const w = parseFloat(event.feature.get('measure'));
  event.feature.set('weight', clamp(w, 0, 1));
});

const raster = new TileLayer({
  source: new Stamen({
    layer: 'toner'
  })
});

const map = new Map({
  //layers: [raster, vector],
  layers: [vector],
  target: 'map',
  view: new View({
    center: [-10901907.596202, 4659866.258372],
    zoom: 4
  })
});


const displayParamChange = function(spanid, newvalue) {
  const spanobj = document.getElementById(spanid);
  while (spanobj.firstChild) {
    spanobj.removeChild(spanobj.firstChild);
  }
  spanobj.appendChild(document.createTextNode(newvalue));
};
blur.addEventListener('input', function() {
  vector.setBlur(parseInt(blur.value, 10));
  displayParamChange('v_blur', blur.value);
});

radius.addEventListener('input', function() {
  vector.setRadius(parseInt(radius.value, 10));
  displayParamChange('v_radius', radius.value);
});
