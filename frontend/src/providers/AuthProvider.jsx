import { useAuth } from "@clerk/clerk-react";
import React, { createContext, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const AuthContext = createContext();
 export default function AuthProvider({ childern }) {
    const { getToken } = useAuth();
useEffect(() => {
 
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          if (
            error.message?.includes("auth") ||
            error.message?.includes("token")
          ) {
            toast.error("Authentication Error. Please login again.");
          }
          console.log("Error fetching auth token:", error);
        }
        return config;
      },
      (error) => {
        console.log("Request Interceptor Error:", error);
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
  }
}, [getToken]);
  return <AuthContext.Provider value={{}}>{childern}</AuthContext.Provider>;
}
