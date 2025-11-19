import React, { useState, useEffect } from 'react';
import { Chat, Channel, ChannelList, Window, MessageList, MessageInput, Thread } from 'stream-chat-react';
import { useStreamAuth } from './hooks/useStreamAuth';
// import 'stream-chat-react/dist/css/index.css';
import "stream-chat-react/dist/css/v2/index.css";
import './App.css';

// --- Komponen Reusable: List User Berdasarkan Role ---
const UserListByRole = ({ client, roleToFind, title, onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!client) return;
      setLoading(true);

      // Filter Stream: Cari user berdasarkan role tertentu
      // $ne: client.userID artinya "bukan diri saya sendiri"
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
  if (users.length === 0) return null; // Jangan tampilkan jika kosong

  return (
    <div className="user-section">
      <h4 style={{ margin: '10px 0 5px', color: '#555', textTransform: 'uppercase', fontSize: '12px' }}>
        {title}
      </h4>
      <ul className="user-list-ul">
        {users.map((u) => (
          <li key={u.id} onClick={() => onUserSelect(u.id)} className="user-item">
            <div className="avatar-circle">{u.name[0]}</div>
            <div className="user-info">
              <div className="name">{u.name}</div>
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
  const { client, login, loading } = useStreamAuth();
  const [channel, setChannel] = useState(null);

  // State Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => { e.preventDefault(); login(email, password); };

  const startChat = async (targetId) => {
    if (!client) return;
    // Logic Chat: Buat channel privat (messaging)
    const newChannel = client.channel('messaging', {
      members: [client.userID, targetId],
    });
    await newChannel.watch();
    setChannel(newChannel);
  };

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

  // TAMPILAN SETELAH LOGIN (DASHBOARD)
  const myRole = client.user.role; // 'admin' atau 'user'

  return (
    <Chat client={client} theme="messaging light">
      <div className="app-layout">
        {/* SIDEBAR KIRI */}
        <div className="sidebar">
          <div className="sidebar-header">
            <strong>{client.user.name}</strong>
            <span className="badge">{myRole}</span>
          </div>

          <div className="sidebar-content">
            {/* 1. INBOX (Chat yang sedang aktif) */}
            <div className="inbox-section">
              <h4 className="section-title">Inbox / Chat Aktif</h4>
              <ChannelList
                filters={{ members: { $in: [client.userID] } }}
                sort={{ last_message_at: -1 }}
                showChannelSearch={false}
              />
            </div>

            {/* 2. LIST UNTUK MEMULAI CHAT BARU */}
            <div className="directory-section">
              {/* POV 2: Jika saya USER, Tampilkan List Admin untuk di-chat */}
              {myRole === 'user' && (
                <UserListByRole
                  client={client}
                  roleToFind="admin"
                  title="Hubungi Admin"
                  onUserSelect={startChat}
                />
              )}

              {/* POV 1 & 3: Tampilkan User Lain (Teman / Customer) */}
              {/* Jika saya Admin -> Cari User. Jika saya User -> Cari User lain */}
              <UserListByRole
                client={client}
                roleToFind="user"
                title={myRole === 'admin' ? "Daftar Customer" : "Teman Komunitas"}
                onUserSelect={startChat}
              />
            </div>
          </div>

          <button onClick={() => window.location.reload()} className="btn-logout">Logout</button>
        </div>

        {/* AREA CHAT KANAN */}
        <div className="chat-area">
          {channel ? (
            <Channel channel={channel}>
              <Window>
                <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <strong>Chatting</strong>
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