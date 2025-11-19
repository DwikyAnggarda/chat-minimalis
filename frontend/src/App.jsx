import React, { useState, useEffect } from 'react';
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator // Digunakan untuk tampilan loading
} from 'stream-chat-react';
import { useStreamAuth } from './hooks/useStreamAuth';
import 'stream-chat-react/dist/css/v2/index.css';
import './App.css';

// --- Komponen Reusable: List User Berdasarkan Role ---
// Komponen ini aman karena menggunakan 'client' sebagai prop, bukan Context
const UserListByRole = ({ client, roleToFind, title, onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!client) return;
      setLoading(true);

      try {
        const response = await client.queryUsers(
          { role: roleToFind, id: { $ne: client.userID } },
          { last_active: -1 },
          { limit: 10 }
        );
        setUsers(response.users);
      } catch (err) {
        console.error(`Gagal ambil list ${roleToFind}`, err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [client, roleToFind]);

  if (loading) return <div style={{ padding: '10px', color: '#999' }}>Loading {title}...</div>;
  if (users.length === 0) return null;

  return (
    <div className="user-section">
      <h4 style={{ margin: '10px 0 5px', color: '#555', textTransform: 'uppercase', fontSize: '12px' }}>
        {title}
      </h4>
      <ul className="user-list-ul">
        {users.map((u) => (
          <li key={u.id} onClick={() => onUserSelect(u.id)} className="user-item">
            <div className="avatar-circle">{u.name ? u.name[0] : u.id[0]}</div>
            <div className="user-info">
              <div className="name">{u.name || u.id}</div>
              <div className="status">{u.online ? '● Online' : 'Offline'}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- APLIKASI UTAMA ---
const App = () => {
  const { client, login, loading, logout } = useStreamAuth();
  const [channel, setChannel] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => { e.preventDefault(); login(email, password); };

  const startChat = async (targetId) => {
    if (!client) return;

    // Reset state channel lokal (Memastikan Channel lama terlepas dari DOM)
    setChannel(null);

    // Buat channel baru
    const newChannel = client.channel('messaging', {
      members: [client.userID, targetId],
    });
    await newChannel.watch();

    // Set channel baru
    setChannel(newChannel);
  };

  // [PERBAIKAN UTAMA] useEffect untuk mereset channel saat client terputus (logout)
  useEffect(() => {
    // Jika client terputus atau berubah menjadi null (saat logout), reset channel
    if (!client && channel) {
      setChannel(null);
    }
  }, [client]);


  // TAMPILAN LOGIN
  if (!client) {
    return (
      <div className="login-wrapper">
        <form onSubmit={handleLogin} className="login-box">
          <h2>Masuk Aplikasi</h2>
          <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Coba: admin1@app.com / andi@gmail.com (Pass: password)
          </div>
        </form>
      </div>
    );
  }

  // [PERBAIKAN: Loading State Aman]
  // Tampilkan loading saat client ada tetapi data user (role) belum tersedia
  if (!client.user || loading) {
    return (
      <div className="full-screen-center">
        <LoadingIndicator />
        <p>Menghubungkan ke server chat...</p>
      </div>
    );
  }


  // TAMPILAN SETELAH LOGIN (DASHBOARD)
  const myRole = client.user.role;

  return (
    // [PERBAIKAN STRUKTUR KRUSIAL]: <Chat> harus membungkus seluruh layout
    <Chat client={client} theme="messaging light">
      <div className="app-layout">

        {/* SIDEBAR KIRI (Sekarang di dalam konteks <Chat>) */}
        <div className="sidebar">
          <div className="sidebar-header">
            <strong>{client.user.name}</strong>
            <span className="badge">{myRole}</span>
          </div>

          <div className="sidebar-content">
            {/* 1. INBOX (Chat yang sedang aktif) */}
            <div className="inbox-section">
              <h4 className="section-title">Inbox / Chat Aktif</h4>
              {/* Komponen Stream sekarang aman di dalam konteks */}
              <ChannelList
                filters={{ members: { $in: [client.userID] } }}
                sort={{ last_message_at: -1 }}
                showChannelSearch={false}
                onSelectChannel={(c) => setChannel(c)}
              />
            </div>

            {/* 2. LIST UNTUK MEMULAI CHAT BARU */}
            <div className="directory-section">
              {myRole === 'user' && (
                <UserListByRole
                  client={client}
                  roleToFind="admin"
                  title="Hubungi Admin"
                  onUserSelect={startChat}
                />
              )}

              <UserListByRole
                client={client}
                roleToFind="user"
                title={myRole === 'admin' ? "Daftar Customer" : "Teman Komunitas"}
                onUserSelect={startChat}
              />
            </div>
          </div>

          {/* [PERBAIKAN STRUKTUR]: Tombol Logout di footer terpisah */}
          <div className="sidebar-footer">
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>

        {/* AREA CHAT KANAN (Juga di dalam konteks <Chat>) */}
        <div className="chat-area">
          {/* HANYA RENDER CHANNEL JIKA ADA CHANNEL AKTIF */}
          {channel ? (
            <Channel channel={channel}>
              <Window>
                <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <strong>Chatting: {channel.data.name || 'Personal Chat'}</strong>
                </div>
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </Channel>
          ) : (
            <div className="empty-chat-placeholder">
              <p>Pilih Admin atau Teman untuk mulai chat.</p>
            </div>
          )}
        </div>
      </div>
    </Chat>
  );
};

export default App;