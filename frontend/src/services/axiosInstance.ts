import axios from "axios";

// 쿠키에서 accessToken 꺼내는 함수
const getCookie = (name: string): string | null => {
    const matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? decodeURIComponent(matches[1]) : null;
};

const axiosInstance = axios.create({
    baseURL: "http://211.254.215.138:8080/api",  // KT Cloud 백엔드 서버
    withCredentials: true, // ✅ 이거 있어야 쿠키 보내짐!
});

// Axios interceptor 수정
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getCookie("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
