using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using ToDoList.Common;
using ToDoList.Common;
using ToDoList.Data;
using ToDoList.DTOs;
using ToDoList.Model;
using ToDoList.Services.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ToDoList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        [HttpGet]
        [Route("GetTasks")]
        public IActionResult GetUserTasks([FromQuery] TaskQueryDto query)
        {

            var tasks = _taskService.GetUserTasks(GetUserId(), query);
            return Ok(ApiResponse<PagedResultDto<TaskDto>>.SuccessResponse(tasks));
        }


        [HttpPost]
        [Route("CreateTask")]
        public IActionResult CreateTask(CreateTaskDto dto)
        {
            var task = _taskService.CreateTask(GetUserId(), dto);

            return Ok(ApiResponse<string>.SuccessResponse("Task was create successfuly"));


        }

        [HttpPut]
        [Route("{taskId}")]
        public IActionResult UpdateTask(int taskId, UpdateTaskDto dto)
        {
            var task = _taskService.UpdateTask(taskId, GetUserId(), dto);
            return Ok(ApiResponse<string>.SuccessResponse("Task was Updated successfuly"));

        }

        [HttpDelete]
        [Route("{taskId}")]
        public IActionResult DeleteTask(int taskId)
        {
            _taskService.DeleteTask(taskId, GetUserId());
            return Ok(ApiResponse<string>.SuccessResponse("Task Deleted successfuly"));
        }

        [HttpPut]
        [Route("Restore/{taskId}")]
        public IActionResult RestoreTask(int taskId)
        {
            _taskService.RestoreTask(GetUserId(), taskId);
            return Ok(ApiResponse<string>.SuccessResponse("Task Restored successfuly"));
        }

        [HttpGet]
        [Route("DeletedTasks")]
        public IActionResult GetDeletedTasks([FromQuery] TaskQueryDto query)
        {
            var tasks = _taskService.GetDeletedTasks( GetUserId(),query);
            return Ok(ApiResponse<PagedResultDto<TaskDto>>.SuccessResponse(tasks));

        }
    }
}

