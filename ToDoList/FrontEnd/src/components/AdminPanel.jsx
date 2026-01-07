import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getAllUsers();
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getDeletedUsers();
      if (response.success) {
        setDeletedUsers(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحميل المستخدمين المحذوفين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'active') {
      fetchUsers();
    } else {
      fetchDeletedUsers();
    }
  }, [activeTab]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'فشل حذف المستخدم');
      }
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      await adminService.restoreUser(userId);
      fetchDeletedUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'فشل استعادة المستخدم');
    }
  };

  return (
    <div className="admin-panel-container">
      <h1>لوحة الإدارة</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'active' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('active')}
        >
          المستخدمون النشطون
        </button>
        <button
          className={activeTab === 'deleted' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('deleted')}
        >
          المستخدمون المحذوفون
        </button>
      </div>

      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>المعرف</th>
                <th>اسم المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th>الدور</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'active' ? users : deletedUsers).map((user) => (
                <tr key={user.userId || user.UserId}>
                  <td>{user.userId || user.UserId}</td>
                  <td>{user.username || user.UserName}</td>
                  <td>{user.email || user.Email}</td>
                  <td>{user.role || user.Role}</td>
                  <td>
                    {activeTab === 'active' ? (
                      <button
                        onClick={() => handleDeleteUser(user.userId || user.UserId)}
                        className="btn-delete"
                      >
                        حذف
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestoreUser(user.userId || user.UserId)}
                        className="btn-restore"
                      >
                        استعادة
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(activeTab === 'active' ? users : deletedUsers).length === 0 && (
            <div className="empty-state">لا يوجد مستخدمون</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
