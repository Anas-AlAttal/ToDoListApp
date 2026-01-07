using ToDoList.DTOs.Admin;

namespace ToDoList.Services.Interfaces
{
    public interface IAdminService
    {
         List<UserAdminDto> GetAllUsers();
            void DeleteUser(int userId);
        void RestoreUser(int userId);
        List<UserAdminDto> GetDeletedUsers();
    }
}
