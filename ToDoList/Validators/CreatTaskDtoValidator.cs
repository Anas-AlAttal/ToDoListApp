using FluentValidation;
using ToDoList.DTOs;

namespace ToDoList.Validators
{
    public class CreatTaskDtoValidator : AbstractValidator<CreateTaskDto>
    {
        public CreatTaskDtoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.").MaximumLength(100).WithMessage("Title cannot exceed 100 characters.").MinimumLength(3).WithMessage("Title must be at least 3 characters");
        }
    }
}
