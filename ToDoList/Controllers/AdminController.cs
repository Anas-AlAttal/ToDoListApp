using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Common;
using ToDoList.Data;
using ToDoList.DTOs.Admin;
using ToDoList.Services;
using ToDoList.Services.Interfaces;

namespace ToDoList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IAdminService _admin;

        public AdminController(ApplicationDbContext dbContext, IAdminService admin)
        {
            _dbContext = dbContext;
            _admin = admin;
        }

        [HttpGet]
        [Route("users")]
        public IActionResult GetAllUsers()
        {
           
            return Ok(ApiResponse<List<UserAdminDto>>.SuccessResponse(_admin.GetAllUsers()));
        }

        [HttpDelete]
        [Route("users/{userId}")]
        public IActionResult Delete(int userId)
        {
            _admin.DeleteUser(userId);
            return Ok(ApiResponse<string>.SuccessResponse("User deleted successfuly"));

        }

        [HttpPut]
        [Route("users/{userId}/restore")]
        public IActionResult Restore(int userId)
        {
            _admin.RestoreUser(userId);
            return Ok(ApiResponse<string>.SuccessResponse("User restored successfuly"));
        }

        [HttpGet]
        [Route("users/deletedUsers")]
        public IActionResult GetDeletedUsers()
        {
            return Ok(ApiResponse<List<UserAdminDto>>.SuccessResponse(_admin.GetDeletedUsers()));
        }

    }
}
