using ToDoList.DTOs;
using ToDoList.Model;

namespace ToDoList.Services.Interfaces
{
    public interface IUserService
    {
        void Register(RegisterDto dto);
        LoginResponseDto Login(LoginDto dto);
        User GetCurrentUser(int userId);
        public LoginResponseDto RefreshToken(RefreshTokenDto dto);
        public void Logout(int userId);

    }
}
