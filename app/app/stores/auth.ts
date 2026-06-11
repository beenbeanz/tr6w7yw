import { defineStore } from "pinia";
import {supabase} from '#imports';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,  
    userEmail: (state) => state.user?.email ?? "Guest",
  },
  
  actions: {
    async fetchUser(){
      try{
        const { data } = await supabase.auth.getSession();
        if(data.session){
          this.user = data.session.user;
          this.isAuthenticated = true;
        }
      }
      catch(err){
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error;
        this.user = data.user;
        this.isAuthenticated = true;
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Login failed";
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      this.loading = true;
      try{
        await supabase.auth.signOut();
        this.user = null;
        this.isAuthenticated = false;
      } catch(err){
        this.error = err instanceof Error ? err.message : "Logout failed";
      } finally{
        this.loading = false;
      }
    },
  },
});