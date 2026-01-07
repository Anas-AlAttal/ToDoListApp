using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoList.Data;
using ToDoList.DTOs;

namespace ToDoList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _dbcontext;

        public TestController(ApplicationDbContext dbcontext)
        {
           _dbcontext = dbcontext;
        }

        [HttpPost]
        [Route("")]
        public ActionResult<int> CreateTask(Model.User user)
        {
            user.UserId = 0;
           
            _dbcontext.Set<Model.User>().Add(user);
            _dbcontext.SaveChanges();
            return Ok(user.UserId);
        }

        [HttpGet]
        [Route("")]
        public ActionResult<List<Model.User>> GetTasks()
        {
            var records = _dbcontext.Users.ToList();
            return Ok(records);
        }
    }
}
