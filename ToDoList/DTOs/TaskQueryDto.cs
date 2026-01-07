namespace ToDoList.DTOs
{
    public class TaskQueryDto
    {
        public int page { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? search { get; set; }
        public bool? isCompleted { get; set; }
    }
}
