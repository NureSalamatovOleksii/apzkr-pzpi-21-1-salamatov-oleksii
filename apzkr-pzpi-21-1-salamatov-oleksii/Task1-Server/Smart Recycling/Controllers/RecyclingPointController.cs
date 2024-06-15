using AutoMapper;
using BLL.Services;
using CORE.Models;
using DAL.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecycling.Dto;

namespace SmartRecycling.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class RecyclingPointController : BaseController
    {
        private readonly StatisticsService statisticsService;

        public RecyclingPointController(SmartRecyclingDbContext dbContext, IMapper mapper, StatisticsService statisticsService) : base(dbContext, mapper)
        {
            this.statisticsService = statisticsService;
        }

        [HttpGet]
        public IEnumerable<RecyclingPoint> GetRecyclingPoints()
        {
            return dbContext.RecyclingPoint.ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecyclingPoint>> GetRecyclingPoint(int id)
        {
            var point = await dbContext.RecyclingPoint
                .Include(p => p.Transportation)
                .FirstOrDefaultAsync(p => p.Id == id);

            if(point == null)
            {
                return NotFound();
            }

            return Ok(point);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecyclingPoint(RecyclingPointDto recyclingPoint)
        {
            var pointMap = _mapper.Map<RecyclingPoint>(recyclingPoint);
            await dbContext.RecyclingPoint.AddAsync(pointMap);
            await dbContext.SaveChangesAsync();

            return Ok(recyclingPoint);
        }
    }
}
