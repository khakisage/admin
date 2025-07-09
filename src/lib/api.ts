import axios from "axios";

// API 인스턴스 생성
export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  //baseURL: "https://www.wooricenter.co.kr/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
    console.log("🚀 ~ adminAuthAPI ~ login ~ email:", email)
    console.log("🚀 ~ adminAuthAPI ~ login ~ password:", password)
    const response = await api.post("/admin/auth/login", {
      adminEmail: email,
      adminPassword: password,
    });
    return response.data;
  },
};

// 가입 요청 목록 API
export const approvalAPI = {
  // 가입 요청 목록 조회 (승인/요청 구분)
  getRequests: async () => {
    const response = await api.get("/requests");
    return response.data;
  },
  
  // 장례식장 가입 요청 목록
  getFuneralRequests: async () => {
    const response = await api.get("/admin/funeral/requests");
    return response.data;
  },
  
  // 팀장 가입 요청 목록
  getManagerRequests: async () => {
    const response = await api.get("/admin/manager/requests");
    return response.data;
  },
  
  // 팀장 파일 목록 조회
  getManagerFiles: async (managerId: string) => {
    const response = await api.get(`/requests/file/${managerId}`);
    return response.data;
  },
  
  // 팀장 가입 승인/거절 처리
  setManagerApproval: async (managerId: string, isApproved: boolean, rejectReason?: string) => {
    const response = await api.patch(`/admin/manager/requests/approve/${managerId}`, {
      isApproved,
      rejectReason: isApproved ? undefined : rejectReason, // 거절일 경우에만 사유를 보냄
    });
    return response.data;
  },
  
  // 장례식장 첨부파일 조회
  getFuneralFiles: async (funeralId: string) => {
    const response = await api.get(`/funeral/requests/file/${funeralId}`);
    return response.data;
  },
  
  // 장례식장 가입 승인/거절 처리
  setFuneralApproval: async (funeralId: string, isApproved: boolean, rejectReason?: string) => {
    const response = await api.patch(`/funeral/requests/approve/${funeralId}`, {
      isApproved,
      rejectReason: isApproved ? undefined : rejectReason, // 거절일 경우에만 사유를 보냄
    });
    return response.data;
  },
};

// 상조팀장 유저 목록 API
export const userAPI = {
  getManagerList: async () => {
    const response = await api.get("/admin/user/userList?type=manager");
    return response.data;
  },
  
  getFuneralList: async () => {
    const response = await api.get("/admin/user/userList?type=funeral");
    return response.data;
  },

  getUserList: async () => {
    const response = await api.get("/admin/user/userList?type=all");
    return response.data;
  },
};

// 캐시 지급 API
export const cashAPI = {
  addCashToUser: async (userId: number, amount: number, userType: string) => {
    const response = await api.post("/admin/cash/user/addCash", {
      userId,
      amount,
      userType,
    });
    return response.data;
  },
};
