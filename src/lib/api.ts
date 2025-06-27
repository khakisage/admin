import axios from "axios";

// API 인스턴스 생성
export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그인 페이지로 리다이렉트
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth/admin/login";
    }
    return Promise.reject(error);
  }
);

// 관리자 로그인 API
export const adminAuthAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/admin/auth/login", {
      adminEmail: email,
      adminPassword: password,
    });
    return response.data;
  },
};
