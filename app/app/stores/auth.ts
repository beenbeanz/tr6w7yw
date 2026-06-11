import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },
  
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        // Your login logic here (e.g., Supabase call)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        this.user = data.user;
        this.isAuthenticated = true;
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Login failed";
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      this.user = null;
      this.isAuthenticated = false;
      // await supabase.auth.signOut();
    },
  },
});