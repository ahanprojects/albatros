import L from "leaflet";

export const userPin = L.divIcon({
  html: `
  <div class="rounded-full relative flex justify-center items-center w-full h-full">
    <div class="absolute w-full h-full bg-blue-400 opacity-30 rounded-full"></div>
    <div class="absolute w-[60%] h-[60%] bg-white rounded-full"></div>
    <div class="absolute w-[40%] h-[40%] bg-blue-500 rounded-full"></div>
  </div>
  `,
  iconSize: [40, 40],
  className: '' // to remove default class
});
