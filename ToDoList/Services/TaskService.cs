using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using ToDoList.Data;
using ToDoList.DTOs;
using ToDoList.Model;
using ToDoList.Services.Interfaces;

namespace ToDoList.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IValidator<CreateTaskDto> _createValidator;
        private readonly IValidator<UpdateTaskDto> _updateValidator;

        public TaskService(ApplicationDbContext dbContext, IValidator<CreateTaskDto> createValidator, IValidator<UpdateTaskDto> updateValidator)
        {
            _dbContext = dbContext;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public PagedResultDto<TaskDto> GetUserTasks(int userId, TaskQueryDto query)
        {
            var tasksQuery = _dbContext.Tasks
                .Where(t => t.UserId == userId);

            if (!string.IsNullOrEmpty(query.search))
                tasksQuery = tasksQuery
                    .Where(t => t.Title.Contains(query.search));

            if (query.isCompleted.HasValue)
                tasksQuery = tasksQuery
                    .Where(t => t.IsCompleted == query.isCompleted.Value);

            var totalItems = tasksQuery.Count();

            var items = tasksQuery.OrderBy(u => u.Id)
                .Skip((query.page - 1) * query.pageSize)
                .Take(query.pageSize)
                .ToList();

            return new PagedResultDto<TaskDto>
            {
                Items = items.Select(t => new TaskDto 
                {
                Id = t.Id,
                Title = t.Title,
                IsCompleted = t.IsCompleted
                }).ToList(),
                Page = query.page,
                PageSize = query.pageSize,
                TotalItems = totalItems
            };
        }

        public TaskItem CreateTask(int userId, CreateTaskDto dto)
        {
            var result = _createValidator.Validate(dto);
            if (!result.IsValid)
                throw new ArgumentException(result.Errors.First().ErrorMessage);
            var task = new TaskItem
            {
                Title = dto.Title,
                IsCompleted = false,
                UserId = userId
            };

            _dbContext.Tasks.Add(task);
            _dbContext.SaveChanges();

            return task;
        }

        public TaskItem UpdateTask(int taskId, int userId, UpdateTaskDto dto)
        {
            var result = _updateValidator.Validate(dto);
            if (!result.IsValid)
                throw new ArgumentException(result.Errors.First().ErrorMessage);

            var task = _dbContext.Tasks
                .FirstOrDefault(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
                throw new KeyNotFoundException("Task not found");

            task.Title = dto.Title;
            task.IsCompleted = dto.IsCompleted;

            _dbContext.SaveChanges();

            return task;
        }

        public void DeleteTask(int taskId, int userId)
        {
            var task = _dbContext.Tasks
                .FirstOrDefault(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
                throw new KeyNotFoundException("Task not found");

            task.IsDeleted = true;
            task.DeletedAt = DateTime.UtcNow;
            _dbContext.SaveChanges();
        }

        public void RestoreTask(int userId, int taskId)
        {
            var task = _dbContext.Tasks.IgnoreQueryFilters().FirstOrDefault(t => 
            t.Id == taskId &&
            t.UserId == userId &&
            t.IsDeleted);

            if (task == null)
                throw new KeyNotFoundException("Task not found");
            task.IsDeleted = false;
            task.DeletedAt = null;

            _dbContext.SaveChanges();
        }

        public PagedResultDto<TaskDto> GetDeletedTasks(int userId, TaskQueryDto query)
        {
            var tasksQuery = _dbContext.Tasks.IgnoreQueryFilters()
                  .Where(t => t.UserId == userId && t.IsDeleted);

            if (!string.IsNullOrEmpty(query.search))
                tasksQuery = tasksQuery
                    .Where(t => t.Title.Contains(query.search));

            if (query.isCompleted.HasValue)
                tasksQuery = tasksQuery
                    .Where(t => t.IsCompleted == query.isCompleted.Value);

            var totalItems = tasksQuery.Count();

            var items = tasksQuery.OrderBy(u => u.Id)
                .Skip((query.page - 1) * query.pageSize)
                .Take(query.pageSize)
                .ToList();

            return new PagedResultDto<TaskDto>
            {
                Items = items.Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsCompleted = t.IsCompleted
                }).ToList(),
                Page = query.page,
                PageSize = query.pageSize,
                TotalItems = totalItems
            };

        }
    }
}
