using ToDoList.DTOs;
using ToDoList.Model;

namespace ToDoList.Services.Interfaces
{
    public interface ITaskService
    {
        PagedResultDto<TaskDto> GetUserTasks(int userId, TaskQueryDto dto);
        TaskItem CreateTask(int userId, CreateTaskDto dto);
        TaskItem UpdateTask(int taskId, int userId, UpdateTaskDto dto);
        void DeleteTask(int taskId, int userId);
        void RestoreTask(int userId, int TaskId);
        PagedResultDto<TaskDto> GetDeletedTasks(int userId, TaskQueryDto query);
    }
}
