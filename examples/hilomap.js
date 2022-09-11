import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import KML from '../src/ol/format/KML.js';
import {clamp} from '../src/ol/math.js';
import {Hilomap, Tile as TileLayer, Vector as VectorLayer} from '../src/ol/layer.js';
import Stamen from '../src/ol/source/Stamen.js';
import VectorSource from '../src/ol/source/Vector.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from '../src/ol/style.js';

const blur = document.getElementById('blur');
const radius = document.getElementById('radius');

console.time('T create hilomap layer');
const vector = new Hilomap({
  source: new VectorSource({
    //url: 'data/kml/2012_Earthquakes_Mag5.kml',
    //url: '/~yxl/data/org_695.kml',
    url: 'data/kml/uscities_sample.kml',
    format: new KML({
      extractStyles: false
    })
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
  staticView: 0,
  //shadow: 100,
  //renderMode: 'image',
  //gradient: ['#c94741', '#f7b799', '#f6f7f7', '#a7d0e4', '#3783bb'],
  weight: function(feature) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it from
    // the Placemark's name instead.
    //const name = feature.get('name');
    //const magnitude = parseFloat(name.substr(2));
    //return magnitude - 5;
    //const puvolt = feature.get('PUVolt');
    ////const w = puvolt * 1.0 / (1.39994159 - 0.55512744);
    //const w = (parseFloat(puvolt) - 0.9) * 1.0 / (1.1 - 0.9);
    //console.log("w = " + w);
    //return w;
    const w = parseFloat(feature.get('measure'));
    return clamp(w, 0, 1);
  }
});
console.timeEnd('T create hilomap layer');
/*
vector.getSource().on('addfeature', function(event) {
  // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
  // standards-violating <magnitude> tag in each Placemark.  We extract it from
  // the Placemark's name instead.
//  const name = event.feature.get('name');
//  const magnitude = parseFloat(name.substr(2));

    const puvolt = event.feature.get('PUVolt');
    //const w = puvolt * 1.0 / (1.39994159 - 0.55512744);
    const w = (parseFloat(puvolt) - 0.9) * 1.0 / (1.1-0.9);

  event.feature.set('weight', clamp(w, 0, 1));
});
*/

const styleFunction = function(feature) {
  // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
  // standards-violating <magnitude> tag in each Placemark.  We extract it from
  // the Placemark's name instead.
  const weight = feature.get('PUVolt') * 1.0;
  const radius = 2;
  let style = null;
  if (!style) {
    style = new Style({
      image: new CircleStyle({
        radius: radius,
        fill: new Fill({
          color: (weight < 1) ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 255, 0.4)'
        }),
        stroke: new Stroke({
          color: 'rgba(255, 204, 0, 0.2)',
          width: 1
        })
      })
    });
  }
  return style;
};

const pvector = new VectorLayer({
  source: new VectorSource({
    url: '/~yxl/data/org_695_minmax.kml',
    format: new KML({
      extractStyles: false
    })
  }),
  style: styleFunction
});

const raster = new TileLayer({
  source: new Stamen({
    layer: 'toner'
  })
});

console.time('T create map');
const map = new Map({
  //layers: [raster, vector, pvector],
  layers: [raster, vector],
  target: 'map',
  view: new View({
    //center: [0, 0],
    center: [-10901907.596202, 4659866.258372],
    //zoom: 2
    zoom: 4
  })
});
console.timeEnd('T create map');

/*
blur.addEventListener('input', function() {
  vector.setBlur(parseInt(blur.value, 10));
});

radius.addEventListener('input', function() {
  vector.setRadius(parseInt(radius.value, 10));
});
*/
const displayParamChange = function(spanid, newvalue) {
  const spanobj = document.getElementById(spanid);
  while (spanobj.firstChild) {
    spanobj.removeChild(spanobj.firstChild);
  }
  spanobj.appendChild(document.createTextNode(newvalue));
};
const blurHandler = function() {
  vector.setBlur(parseInt(blur.value, 10));
  displayParamChange('v_blur', blur.value);
};
blur.addEventListener('input', blurHandler);
blur.addEventListener('change', blurHandler);

const radiusHandler = function() {
  vector.setRadius(parseInt(radius.value, 10));
  displayParamChange('v_radius', radius.value);
};
radius.addEventListener('input', radiusHandler);
radius.addEventListener('change', radiusHandler);
