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
    center: [11891834.611295423, -689017.8267312223],
    zoom: 2
  }),
  controls: defaults({ attribution: false, zoom: false, rotate: false }),
  interactions: interactionDefaults({})
});

/**
useEffect(() => {
    async function loadMap() {
      try {
        const { map } = await import("@/components/map");
        if (mapRef.current) map.setTarget(mapRef.current);
        return () => map.setTarget();
      } catch (error) {
        console.error("Error loading map:", error);
      }
    }

    loadMap();
  }, []);
 */