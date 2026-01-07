using Microsoft.EntityFrameworkCore;
using ToDoList.Data;
using ToDoList.DTOs.Admin;
using ToDoList.Services.Interfaces;

namespace ToDoList.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _dbContext;

        public AdminService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<UserAdminDto> GetAllUsers()
        {
            var users = _dbContext.Users;
            return users.Select(u => new UserAdminDto
            {
                UserId = u.UserId,
                UserName = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            }).ToList();
        }
        public void DeleteUser(int userId)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.UserId == userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            if (user.Role == "Admin")
                throw new InvalidOperationException("Cannot delete an admin user.");

            user.IsDeleted = true;
            user.DeletedAt = DateTime.UtcNow;
            _dbContext.SaveChanges();
        }

        public void RestoreUser(int userId)
        {
           var user = _dbContext.Users.IgnoreQueryFilters().FirstOrDefault(u => u.UserId == userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            user.IsDeleted = false;
            user.DeletedAt = null;
            _dbContext.SaveChanges();
        }

        public List<UserAdminDto> GetDeletedUsers()
        {
          var deletedUsers = _dbContext.Users
                .IgnoreQueryFilters()
                .Where(u => u.IsDeleted);
            return deletedUsers.Select(u => new UserAdminDto
            {
                UserId = u.UserId,
                UserName = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            }).ToList();
        }
    }
}
