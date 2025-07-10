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
    console.log("🚀 ~ token:", token)
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
  (response) => response,
  (error) => {
    const isLoginRequest =
      error.config?.url?.includes("/admin/auth/login") ||
      error.config?.url?.includes("/api/admin/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
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
    console.log("🚀 ~ approvalAPI ~ setManagerApproval ~ managerId:", managerId)
    console.log("🚀 ~ approvalAPI ~ setManagerApproval ~ isApproved:", isApproved)
    console.log("🚀 ~ approvalAPI ~ setManagerApproval ~ rejectReason:", rejectReason)
    const response = await api.patch(`/admin/manager/requests/approve/${managerId}`, {
      isApproved,
      message: isApproved ? undefined : rejectReason, // 거절일 경우에만 사유를 보냄
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
    const response = await api.patch(`/admin/funeral/requests/approve/${funeralId}`, {
      isApproved,
      message: isApproved ? undefined : rejectReason, // 거절일 경우에만 사유를 보냄
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
  getAllCashChargeHistory: async () => {
    const response = await api.get("/admin/cash/all/history");
    return response.data;
  },
  getAllRefundRequests: async (type: string = "all") => {
    const response = await api.get(`/admin/cash/all/refund?type=${type}`);
    return response.data;
  },

  // 환급 승인/거절 처리
  processRefundApproval: async ({
    type,
    requestId,
    action,
  }: {
    type: "manager" | "funeral";
    requestId: number;
    action: "approve" | "reject";
  }) => {
    const response = await api.patch(`/admin/cash/${type}/${requestId}`, {
      action,
    });
    return response.data;
  },

  getRefundHistory: async (type: string = "all") => {
    const response = await api.get(`/admin/cash/refund/history?type=${type}`);
    return response.data;
  },
};

// 공지사항 등록/수정 API
export const noticeAPI = {
  // 공지사항 리스트 조회
  getNoticeList: async (params: { userType?: string; isVisible?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.userType) query.append("userType", params.userType);
    if (typeof params.isVisible === "boolean") query.append("isVisible", String(params.isVisible));
    const response = await api.get(`/admin/notices/list?${query.toString()}`);
    return response.data;
  },

  // 등록
  createNotice: async ({
    title,
    content,
    userType,
    isActive,
  }: {
    title: string;
    content: string;
    userType: "manager" | "funeral" | "all";
    isActive: boolean;
  }) => {
    const response = await api.post("/admin/notices/create", {
      title,
      content,
      userType,
      isVisible: isActive,
    });
    return response.data;
  },

  // 수정
  updateNotice: async ({
    id,
    title,
    content,
    isActive,
  }: {
    id: string;
    title: string;
    content: string;
    isActive: boolean;
  }) => {
    const response = await api.patch(`/admin/notices/update/${id}`, {
      title,
      content,
      isVisible: isActive,
    });
    return response.data;
  },
};
