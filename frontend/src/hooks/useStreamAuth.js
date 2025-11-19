import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

// Setup Axios agar selalu kirim cookie & header CSRF (Sanctum requirement)
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export const useStreamAuth = () => {
    const [client, setClient] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            // URL API dari .env
            const API_URL = import.meta.env.VITE_API_URL;
            const STREAM_KEY = import.meta.env.VITE_STREAM_API_KEY;

            if (!API_URL || !STREAM_KEY) {
                throw new Error("ENV belum diset dengan benar!");
            }

            console.log("1. Getting CSRF Cookie...");
            // Hapus '/api' dari URL untuk endpoint sanctum
            const baseURL = API_URL.replace('/api', '');
            await axios.get(`${baseURL}/sanctum/csrf-cookie`);

            console.log("2. Logging in...");
            await axios.post(`${baseURL}/login`, { email, password });

            console.log("3. Getting Stream Token...");
            const response = await axios.get(`${API_URL}/stream/token`);

            const { token, stream_user_id, stream_api_key } = response.data;

            // 4. Connect Stream
            console.log("4. Connecting to Stream...");
            const chatClient = StreamChat.getInstance(stream_api_key);

            await chatClient.connectUser(
                { id: stream_user_id }, // Data user detail harusnya dari upsertUser di backend
                token
            );

            setClient(chatClient);
            setUser({ id: stream_user_id });

        } catch (error) {
            console.error("Login Error:", error);
            alert(`Login Gagal: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (client) await client.disconnectUser();
        setClient(null);
        setUser(null);
    };

    return { client, user, login, logout, loading };
};