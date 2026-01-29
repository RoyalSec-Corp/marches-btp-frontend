import axios from "axios";

export function createApi(baseURL, options = {}) {
  const instance = axios.create({
    baseURL,
    timeout: options.timeout || 15000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      if (process.env.NODE_ENV === "development") {
        const method = config.method?.toUpperCase();
        const fullUrl = `${config.baseURL?.replace(/\/$/, "")}${config.url}`;
        console.log(`[HTTP ${method}] -> ${fullUrl}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, config } = error.response;
        if (status === 401) {
          console.warn(`401 non autorise sur ${config?.url}`);
        } else if (status >= 500) {
          console.error("Erreur serveur:", error.response.data || error.message);
        }
      } else {
        console.error("Erreur reseau ou CORS:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
