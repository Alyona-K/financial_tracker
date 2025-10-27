import axios, { AxiosHeaders } from "axios";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { API_URL } from "@/shared/config/config";

export const api = axios.create({ baseURL: API_URL });

// Добавляем интерцептор для запроса
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Интерцептор для ответа: если 401, делаем автологин demo-user и повторяем запрос
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const authStore = useAuthStore.getState();
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry // чтобы не зациклить
    ) {
      originalRequest._retry = true;
      await authStore.refreshToken();
      originalRequest.headers["Authorization"] = `Bearer ${authStore.token}`;
      return api.request(originalRequest);
    }

    return Promise.reject(error);
  }
);



// import axios, { AxiosHeaders } from "axios";
// import { useAuthStore } from "@/entities/auth/model/auth.store";
// import { API_URL } from "@/shared/config/config";

// export const api = axios.create({ baseURL: API_URL });

// // Добавляем интерцептор для запроса
// api.interceptors.request.use((config) => {
//   const { token } = useAuthStore.getState();
//   if (token) {
//     if (!config.headers) config.headers = new AxiosHeaders();
//     (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
//   }
//   return config;
// });

// // Интерцептор для ответа: если 401, делаем автологин demo-user и повторяем запрос
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const authStore = useAuthStore.getState();
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       await authStore.initDemoUser(); // перезалогиниваем демо
//       originalRequest.headers["Authorization"] = `Bearer ${authStore.token}`;
//       return api.request(originalRequest);
//     }

//     return Promise.reject(error);
//   }
// );
