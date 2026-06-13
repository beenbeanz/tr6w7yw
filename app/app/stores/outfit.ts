import { defineStore } from "pinia";

export const useOutfitStore = defineStore("outfit", {
  state: () => ({
    dress: null as any,
    shoe: null as any,
    accessory: null as any,
  }),
});