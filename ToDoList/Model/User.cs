namespace ToDoList.Model
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }  
        public string Role { get; set; } = "User";
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        // علاقة 1 : N مع المهام
        public ICollection<TaskItem> Tasks { get; set; }
    }
}
