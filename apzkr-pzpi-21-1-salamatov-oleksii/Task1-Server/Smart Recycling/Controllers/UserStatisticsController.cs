using CORE.Models;
using DAL.Contexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecycling.Dto;

namespace SmartRecycling.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserStatisticsController : Controller
    {
        private readonly SmartRecyclingDbContext dbContext;

        public UserStatisticsController(SmartRecyclingDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<int>> GetUserBonuses(int userId)
        {
            var user = await dbContext.UserStatistics.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound();
            }

            return user.Bonuses;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserStatistics(UserStatistics userStatistics)
        {
            await dbContext.UserStatistics.AddAsync(userStatistics);
            await dbContext.SaveChangesAsync();

            return Ok(userStatistics);
        }

/*        [HttpPut]
        public async Task<IActionResult> UpdateUserStatistics(int id, UserStatistics userStatistics)
        {

            dbContext.SaveChangesAsync();

            return Ok(userStatistics);
        }*/
    }
}
