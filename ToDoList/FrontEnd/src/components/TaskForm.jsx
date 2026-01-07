import { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title: title.trim() });
      setTitle('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="أدخل عنوان المهمة..."
        className="task-input"
        autoFocus
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          إضافة
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
