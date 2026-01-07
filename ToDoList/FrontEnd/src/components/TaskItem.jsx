import { useState } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete, onRestore, isDeleted = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editIsCompleted, setEditIsCompleted] = useState(task.isCompleted);

  const handleSave = () => {
    if (!isDeleted) {
      onUpdate(task.id, {
        title: editTitle,
        isCompleted: editIsCompleted,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditIsCompleted(task.isCompleted);
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    if (!isDeleted) {
      onUpdate(task.id, {
        title: task.title,
        isCompleted: !task.isCompleted,
      });
    }
  };

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''} ${isDeleted ? 'deleted' : ''}`}>
      {isEditing && !isDeleted ? (
        <div className="task-edit">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={editIsCompleted}
              onChange={(e) => setEditIsCompleted(e.target.checked)}
            />
            مكتملة
          </label>
          <div className="task-actions">
            <button onClick={handleSave} className="btn-save">
              حفظ
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <label className="checkbox-label">
              {!isDeleted && (
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={handleToggleComplete}
                />
              )}
              <span className="task-title">{task.title}</span>
              {isDeleted && <span className="deleted-badge">محذوفة</span>}
            </label>
          </div>
          <div className="task-actions">
            {isDeleted ? (
              <button onClick={() => onRestore(task.id)} className="btn-restore">
                استعادة
              </button>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="btn-edit">
                  تعديل
                </button>
                <button onClick={() => onDelete(task.id)} className="btn-delete">
                  حذف
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
