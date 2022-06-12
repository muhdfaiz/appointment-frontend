import axios from "axios";

/**
 * Base Service
 */
export default class BaseService {
    constructor(publicURL = false) {
        this.baseURL = import.meta.env.VITE_API_URL;

        // Create axios instance.
        this.axios = axios.create();

        // If public URL no need to set Authorization Header.
        if (publicURL) {
            return;
        }

        // Axios interceptor to set Authorization Token in the header.
        this.axios.interceptors.request.use(
            async (config) => {
                const token = window.localStorage.getItem("token");

                config.headers = {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                };

                return config;
            },
            (error) => {
                Promise.reject(error);
            }
        );
    }
}
