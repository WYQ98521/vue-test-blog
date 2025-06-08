// utils/request.js
import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  baseURL: "http://localhost:8080", // 从环境变量获取 baseURL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么
    // 例如：添加 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 处理响应数据
    const res = response.data;

    // 假设业务成功码为 200
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || "请求失败"));
    }

    return res.data; // 直接返回业务数据，跳过外层包装
  },
  (error) => {
    // 处理响应错误
    const { message, response } = error;

    if (response) {
      // HTTP 状态码错误
      const status = response.status;
      const errorMsg = `HTTP错误 ${status}: ${response.data.message}`;
    } else if (message.includes("timeout")) {
      // 超时错误
      console.log("请求超时，请稍后重试");
    } else {
      // 网络错误（如断网）
      console.log("网络连接失败，请检查网络");
    }

    return Promise.reject(error);
  }
);

// 导出封装后的请求方法
export default service;
