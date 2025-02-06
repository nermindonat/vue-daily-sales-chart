import { createStore } from "vuex";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthState {
  token: string | null;
  error: string | null;
  userInfo: object | null;
}

export default createStore({
  state: (): AuthState => ({
    token: localStorage.getItem("token") || null,
    error: null,
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
  }),
  mutations: {
    setToken(state: AuthState, token: string) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    setError(state: AuthState, error: string | null) {
      state.error = error;
    },
    setUserInfo(state: AuthState, userInfo: object) {
      state.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    clearAuth(state: AuthState) {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
  actions: {
    async login({ commit }, credentials: { email: string; password: string }) {
      commit("setError", null);
      try {
        const response = await axios.post(`${API_BASE_URL}/oauth/token`, {
          Email: credentials.email,
          Password: credentials.password,
          GrantType: "password",
          Scope: "amazon_data",
          ClientId: "C0001",
          ClientSecret: "SECRET0001",
          RedirectUri: "https://api.eva.guru",
        });

        if (response.data.ApiStatus === false) {
          const errorMessage = "E-posta adresiniz veya şifreniz hatalı.";
          commit("setError", errorMessage);
          throw new Error(errorMessage);
        }

        const token = response.data.Data.AccessToken;
        commit("setToken", token);
      } catch (error: any) {
        commit(
          "setError",
          error.response?.data?.message || error.message || "Login failed"
        );
        throw error;
      }
    },

    async fetchUserInformation({ commit, state }, email: string) {
      if (!state.token) {
        commit("setError", "Token bulunamadı, lütfen giriş yapınız.");
        return;
      }

      commit("setError", null);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/user-information`,
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );

        commit("setUserInfo", response.data);
      } catch (error: any) {
        commit(
          "setError",
          error.response?.data?.message || "Kullanıcı bilgileri alınamadı"
        );
        throw error;
      }
    },

    async logout({ commit }) {
      commit("clearAuth");
    },

    initializeAuth({ commit }) {
      const token = localStorage.getItem("token");
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
      if (token) {
        commit("setToken", token);
      }
      if (userInfo) {
        commit("setUserInfo", userInfo);
      }
    },
  },
  getters: {
    isAuthenticated: (state: AuthState) => !!state.token,
    getToken: (state: AuthState) => state.token,
    getError: (state: AuthState) => state.error,
    getUserInfo: (state: AuthState) => state.userInfo,
  },
});
