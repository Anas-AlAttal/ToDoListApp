import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'deleted'
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [deletedPagination, setDeletedPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    isCompleted: null,
  });

  const fetchTasks = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getTasks({
        page,
        pageSize: pagination.pageSize,
        ...filters,
      });
      
      if (response.success && response.data) {
        setTasks(response.data.items || response.data.Items || []);
        setPagination({
          page: response.data.page || response.data.Page || page,
          pageSize: response.data.pageSize || response.data.PageSize || 10,
          totalCount: response.data.totalItems || response.data.TotalItems || 0,
          totalPages: response.data.totalPages || response.data.TotalPages || 0,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحميل المهام');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedTasks = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getDeletedTasks({
        page,
        pageSize: deletedPagination.pageSize,
        ...filters,
      });
      
      if (response.success && response.data) {
        setDeletedTasks(response.data.items || response.data.Items || []);
        setDeletedPagination({
          page: response.data.page || response.data.Page || page,
          pageSize: response.data.pageSize || response.data.PageSize || 10,
          totalCount: response.data.totalItems || response.data.TotalItems || 0,
          totalPages: response.data.totalPages || response.data.TotalPages || 0,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحميل المهام المحذوفة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'active') {
      fetchTasks(1);
    } else {
      fetchDeletedTasks(1);
    }
  }, [filters, activeTab]);

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      setShowForm(false);
      fetchTasks(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إنشاء المهمة');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await taskService.updateTask(taskId, taskData);
      fetchTasks(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحديث المهمة');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      try {
        await taskService.deleteTask(taskId);
        fetchTasks(pagination.page);
      } catch (err) {
        setError(err.response?.data?.message || 'فشل حذف المهمة');
      }
    }
  };

  const handleRestoreTask = async (taskId) => {
    try {
      await taskService.restoreTask(taskId);
      fetchDeletedTasks(deletedPagination.page);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل استعادة المهمة');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>قائمة المهام</h1>
        {activeTab === 'active' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'إلغاء' : 'إضافة مهمة جديدة'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Tabs */}
      <div className="task-tabs">
        <button
          className={activeTab === 'active' ? 'tab-active' : 'tab'}
          onClick={() => {
            setActiveTab('active');
            setShowForm(false);
          }}
        >
          المهام النشطة
        </button>
        <button
          className={activeTab === 'deleted' ? 'tab-active' : 'tab'}
          onClick={() => {
            setActiveTab('deleted');
            setShowForm(false);
          }}
        >
          المهام المحذوفة
        </button>
      </div>

      {activeTab === 'active' && showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="بحث في المهام..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />
        <select
          value={filters.isCompleted === null ? '' : filters.isCompleted}
          onChange={(e) =>
            handleFilterChange(
              'isCompleted',
              e.target.value === '' ? null : e.target.value === 'true'
            )
          }
          className="filter-select"
        >
          <option value="">جميع المهام</option>
          <option value="true">مكتملة</option>
          <option value="false">غير مكتملة</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : activeTab === 'active' ? (
        tasks.length === 0 ? (
          <div className="empty-state">لا توجد مهام</div>
        ) : (
          <>
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => fetchTasks(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary"
                >
                  السابق
                </button>
                <span>
                  صفحة {pagination.page} من {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchTasks(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn-secondary"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )
      ) : (
        deletedTasks.length === 0 ? (
          <div className="empty-state">لا توجد مهام محذوفة</div>
        ) : (
          <>
            <div className="tasks-grid">
              {deletedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onRestore={handleRestoreTask}
                  isDeleted={true}
                />
              ))}
            </div>

            {deletedPagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => fetchDeletedTasks(deletedPagination.page - 1)}
                  disabled={deletedPagination.page === 1}
                  className="btn-secondary"
                >
                  السابق
                </button>
                <span>
                  صفحة {deletedPagination.page} من {deletedPagination.totalPages}
                </span>
                <button
                  onClick={() => fetchDeletedTasks(deletedPagination.page + 1)}
                  disabled={deletedPagination.page >= deletedPagination.totalPages}
                  className="btn-secondary"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default TaskList;
