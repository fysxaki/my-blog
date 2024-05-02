import { defineStore } from "pinia";

interface AdminState {
  id: number;
  account: string;
  token: string;
}

export const AdminStore = defineStore("admin", {
  state: (): AdminState => {
    return {
      id: 0,
      account: "",
      token: "",
    };
  },
  actions: {},
  getters: {},
});
