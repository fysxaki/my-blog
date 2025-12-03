import { createPinia, defineStore } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
interface AdminState {
  id: number;
  account: string;
  token: string;
}

export const AdminStore = defineStore("admin", {
  persist: true,
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
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
export { pinia };