import { Map } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { defaults } from "ol/control/defaults";
import { defaults as interactionDefaults } from "ol/interaction/defaults";

export const map = new Map({
  target: "map",
  layers: [new TileLayer({
    visible: true,
    source: new OSM()
  })],
  view: new View({
    center: [0, 0],
    zoom: 2
  }),
  controls: defaults(),
  interactions: interactionDefaults({})
});