using ToDoList.Data;
using ToDoList.DTOs;
using ToDoList.Model;
using ToDoList.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Data;
using ToDoList.DTOs;
using System.Security.Cryptography;
using System.Text;
using ToDoList.Model;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace ToDoList.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _dbContext;

        public UserService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public User GetCurrentUser(int userId)
        {
           return _dbContext.Users.FirstOrDefault(u => u.UserId == userId);
        }

        public LoginResponseDto Login(LoginDto dto)
        {
            var HashedPassword = HashPassword(dto.Password);

            var user = _dbContext.Users
                  .FirstOrDefault(u => u.Username == dto.UserName && u.PasswordHash == HashedPassword);

            if (user == null)
                throw new ArgumentException("Invalid Password Or Username");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.UserId.ToString()),
                new Claim(ClaimTypes.Name,user.Username),
                new Claim(ClaimTypes.Role,user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("W0Y1*ND*hUFi;pNc#D5j#X=V6EKa@!Y0"));

            var token = new JwtSecurityToken(
                issuer: "TaskManagerAPI",
                audience: "TaskManagerAPI",
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            _dbContext.SaveChanges();

            return new LoginResponseDto
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refreshToken
            };
        }

        public void Register(RegisterDto dto)
        {
            if (_dbContext.Users.Any(u => u.Username == dto.UserName))
            {
               throw new ArgumentException("Username already exists.");
            }
            if (_dbContext.Users.Any(u => u.Email == dto.Email))
            {
                throw new ArgumentException("Email already exists.");
            }
            var user = new User
            {
                Username = dto.UserName,
                PasswordHash = (string)HashPassword(dto.Password),
                Email = dto.Email,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
           
        }

        public LoginResponseDto RefreshToken(RefreshTokenDto dto)
        {
            var user = _dbContext.Users
                .FirstOrDefault(u => u.RefreshToken == dto.RefreshToken && u.RefreshTokenExpiry > DateTime.UtcNow && !u.IsDeleted);

            if (user == null)
            {
                throw new ArgumentException("Invalid refresh token.");
            }
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.UserId.ToString()),
                new Claim(ClaimTypes.Name,user.Username),
                new Claim(ClaimTypes.Role,user.Role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("W0Y1*ND*hUFi;pNc#D5j#X=V6EKa@!Y0"));
            var accessToken = new JwtSecurityToken(
                issuer: "TaskManagerAPI",
                audience: "TaskManagerAPI",
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );
            var newRefreshToken = GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            _dbContext.SaveChanges();
            return new LoginResponseDto
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
                RefreshToken = newRefreshToken
            };
        }

        public void Logout(int userId)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.UserId == userId);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }
            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            _dbContext.SaveChanges();
        }

        private object HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }
    }
}
