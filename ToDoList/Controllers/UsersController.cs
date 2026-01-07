using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ToDoList.Common;
using ToDoList.Data;
using ToDoList.DTOs;
using ToDoList.Model;
using ToDoList.Services.Interfaces;

namespace ToDoList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
   
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
           _userService = userService;
        }



        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            _userService.Register(dto);
            return Ok(ApiResponse<string>.SuccessResponse("User registered successfully"));

        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
           var token = _userService.Login(dto);
            return Ok(ApiResponse<object>.SuccessResponse( new { token }));
        }

        [HttpPost]
        [Route("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var token = _userService.RefreshToken(dto);
            return Ok(ApiResponse<object>.SuccessResponse(new { token }));
        }

        [Authorize]
        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier));
            _userService.Logout(userId);
            return Ok(ApiResponse<string>.SuccessResponse("User logged out successfully"));
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier));

            var user = _userService.GetCurrentUser(userId);

            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email
            });
        }


    }
}
