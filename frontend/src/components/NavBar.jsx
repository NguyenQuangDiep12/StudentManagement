import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

const roleLabels = {
  admin: 'Quản trị viên',
  lecturer: 'Giảng viên',
  student: 'Sinh viên'
};

export default function NavBar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  async function loadNotifications() {
    try {
      setNotifications(await apiRequest('/notifications', { token }));
    } catch (error) {
      console.error('Không thể tải thông báo:', error);
    }
  }

  useEffect(() => {
    if (!token) return undefined;
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(timer);
  }, [token]);

  async function markAsRead(notification) {
    if (Number(notification.isRead)) return;
    try {
      await apiRequest(`/notifications/${notification.id}/read`, { method: 'PUT', token });
      setNotifications((items) => items.map((item) => (
        item.id === notification.id ? { ...item, isRead: 1 } : item
      )));
    } catch (error) {
      console.error('Không thể đánh dấu thông báo đã đọc:', error);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    try {
      const result = await apiRequest('/auth/change-password', {
        method: 'PUT',
        token,
        body: passwordForm
      });
      setPasswordMessage(result.message);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.message);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="topbar card">
      <div>
        <p className="eyebrow">School Management System</p>
        <h1>Hệ thống quản lí sinh viên</h1>
        <p className="topbar-subtitle">Quản lý hồ sơ, bảng điểm và lịch học trên cùng một giao diện.</p>
      </div>

      <div className="topbar-actions">
        <div className="notification-control">
          <button
            type="button"
            className="notification-bell"
            aria-label={`Thông báo${notifications.some((item) => !Number(item.isRead)) ? ', có thông báo chưa đọc' : ''}`}
            aria-expanded={showNotifications}
            onClick={() => { setShowNotifications((visible) => !visible); loadNotifications(); }}
          >
            <span aria-hidden="true">🔔</span>
            {notifications.some((item) => !Number(item.isRead)) && <i className="notification-indicator" />}
          </button>
          {showNotifications && (
            <section className="notification-popover" aria-label="Thông báo trong ứng dụng">
              <h3>Thông báo</h3>
              {notifications.length ? notifications.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`notification-item ${Number(item.isRead) ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(item)}
                >
                  <strong>{item.title}</strong>
                  <span>{item.message}</span>
                  <small>{new Date(`${item.createdAt.replace(' ', 'T')}Z`).toLocaleString('vi-VN')}</small>
                </button>
              )) : <p className="notification-empty">Chưa có thông báo.</p>}
            </section>
          )}
        </div>

        <div className="user-chip">
          <div className="user-chip-avatar">{user?.fullName?.charAt(0) || 'U'}</div>
          <div>
            <strong>{user?.fullName}</strong>
            <div className="role-badge">{roleLabels[user?.role] || user?.role}</div>
          </div>
        </div>

        <button className="btn btn-light" onClick={() => { setShowPasswordForm(true); setPasswordError(''); setPasswordMessage(''); }}>
          Đổi mật khẩu
        </button>

        <button className="btn btn-danger" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
      {showPasswordForm && createPortal(
        <div className="password-dialog-backdrop" role="presentation" onClick={() => setShowPasswordForm(false)}>
          <section className="password-dialog card" role="dialog" aria-modal="true" aria-labelledby="change-password-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="change-password-title">Đổi mật khẩu</h2>
            {passwordError && <div className="alert error">{passwordError}</div>}
            {passwordMessage && <div className="alert success">{passwordMessage}</div>}
            <form className="auth-form" onSubmit={handleChangePassword}>
              <label>Mật khẩu cũ<input type="password" autoComplete="current-password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((form) => ({ ...form, currentPassword: event.target.value }))} required /></label>
              <label>Mật khẩu mới<input type="password" autoComplete="new-password" minLength={6} maxLength={30} value={passwordForm.newPassword} onChange={(event) => setPasswordForm((form) => ({ ...form, newPassword: event.target.value }))} required /></label>
              <label>Xác nhận mật khẩu mới<input type="password" autoComplete="new-password" minLength={6} maxLength={30} value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((form) => ({ ...form, confirmPassword: event.target.value }))} required /></label>
              <div className="password-dialog-actions">
                <button type="button" className="btn btn-light" onClick={() => setShowPasswordForm(false)}>Đóng</button>
                <button type="submit" className="btn btn-primary">Lưu mật khẩu</button>
              </div>
            </form>
          </section>
        </div>,
        document.body
      )}
    </header>
  );
}
