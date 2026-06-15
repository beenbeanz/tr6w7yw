import { defineStore } from "pinia";

export const useOutfitStore = defineStore("outfit", {
  state: () => ({
    dress: null as any,
    shoe: null as any,
    accessory: null as any,
    dressPosition: { translateX: -30, translateY: -50, rotation: 0, width: 615 },
    shoePosition: { translateX: -45, translateY: -7, rotation: 0, width: 677 },
    accessoryPosition: { translateX: -120, translateY: -50, rotation: 0, width: 200 },
  }),
});