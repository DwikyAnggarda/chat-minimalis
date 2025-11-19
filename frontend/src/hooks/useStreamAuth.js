import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

// --- Local Storage Helpers ---
const getSanctumToken = () => localStorage.getItem('sanctum_token');
const setSanctumToken = (token) => localStorage.setItem('sanctum_token', token);
const removeSanctumToken = () => localStorage.removeItem('sanctum_token');

// Hapus axios.defaults.withCredentials = true; karena kita pakai token
// Kita akan set header Authorization secara manual!

export const useStreamAuth = () => {
    const [client, setClient] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const login = async (email, password) => {
        setLoading(true);
        try {
            // 1. Login ke Laravel & Dapatkan Bearer Token
            const loginResponse = await axios.post(`${API_URL}/login`, { email, password });
            const sanctumToken = loginResponse.data.token;
            setSanctumToken(sanctumToken);

            // 2. Set Header Default untuk semua request selanjutnya (Termasuk stream/token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${sanctumToken}`;

            // 3. Minta Token Stream (Sekarang token Sanctum di header)
            const streamResponse = await axios.get(`${API_URL}/stream/token`);

            const { token: streamToken, stream_user_id, stream_api_key } = streamResponse.data;

            // 4. Connect Stream
            const chatClient = StreamChat.getInstance(stream_api_key);
            await chatClient.connectUser({ id: stream_user_id }, streamToken);

            setClient(chatClient);
            setUser({ id: stream_user_id });

        } catch (error) {
            console.error("Login Error:", error);
            removeSanctumToken();
            axios.defaults.headers.common['Authorization'] = ''; // Hapus header jika gagal
            const msg = error.response?.data?.message || 'Login gagal, cek konsol.';
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        // Hapus Token di server Laravel & lokal
        try {
            await axios.post(`${API_URL}/logout`);
        } catch (e) {
            console.warn("Logout Laravel failed, but proceeding with local reset.");
        }

        if (client) await client.disconnectUser();
        axios.defaults.headers.common['Authorization'] = '';
        removeSanctumToken();
        setClient(null);
        setUser(null);
    };

    // [PENTING] Re-Authentication saat App dimuat atau refresh
    useEffect(() => {
        const initializeAuth = async () => {
            const token = getSanctumToken();
            if (token) {
                setLoading(true);
                // Set Header Sanctum Token
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                try {
                    // Cek validitas token via /stream/token (atau /user)
                    const streamResponse = await axios.get(`${API_URL}/stream/token`);

                    const { token: streamToken, stream_user_id, stream_api_key } = streamResponse.data;

                    const chatClient = StreamChat.getInstance(stream_api_key);
                    await chatClient.connectUser({ id: stream_user_id }, streamToken);

                    setClient(chatClient);
                    setUser({ id: stream_user_id });
                } catch (error) {
                    console.error("Re-auth failed. Clearing token.", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            }
        };
        initializeAuth();
    }, []);


    return { client, user, login, logout, loading };
};