namespace ToDoList.Model
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        // FK
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
