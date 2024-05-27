import L from "leaflet";

export const userPin = L.divIcon({
  html: `
  <div class="rounded-full relative flex justify-center items-center w-full h-full">
    <div class="absolute w-full h-full bg-blue-400 opacity-30 rounded-full"></div>
    <div class="absolute w-[60%] h-[60%] bg-white rounded-full"></div>
    <div class="absolute w-[35%] h-[35%] bg-blue-500 rounded-full"></div>
  </div>
  `,
  iconSize: [40, 40],
  className: '' // to remove default class
});

export const startPin = L.divIcon({
  html: `
  <div class="rounded-full relative flex justify-center items-center w-full h-full">
    <div class="absolute w-full h-full bg-white rounded-full"></div>
    <div class="absolute w-[60%] h-[60%] bg-blue-500 rounded-full"></div>
  </div>
  `,
  iconSize: [20, 20],
  className: '' // to remove default class
});

export const redPin = L.icon({
  iconUrl: '/pin.png',
  // shadowUrl: '/pinshadow.png',
  iconSize: [32, 42],
  iconAnchor: [19.5, 42],
  popupAnchor: [-2,-21]
  // shadowAnchor: [1, 42],
  // shadowSize:   [20, 30],
})