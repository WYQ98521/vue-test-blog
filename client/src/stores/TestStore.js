import { defineStore } from "pinia";
export const TestStore = defineStore("test", {
  state: () => {
    return {
      id: 0,
      user: "wff",
      password: "654321",
      count: 100,
    };
  },
  actions: {
    increment() {
      this.count++;
    },
  },
  getters: {
    getName: (state) => {
      return state.user + "🐔你太美";
    },
    multiplyBy: (state) => (factor) => state.count * factor,
  },
});
