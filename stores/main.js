// import { defineStore } from 'pinia';

export const useMainStore = defineStore('useMainStore', {
  state: () => ({
    count: 99,
    players: [],
    users: [],
  }),
});
