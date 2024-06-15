using AutoMapper;
using BLL.Services;
using CORE.Models;
using DAL.Contexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecycling.Dto;
using System.IO;
using System.Xml.XPath;

namespace SmartRecycling.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CollectionPointController : Controller
    {
        private readonly SmartRecyclingDbContext dbContext;
        private readonly IMapper _mapper;
        private readonly PointStateService pointService;
        private StatisticsService statisticsService;

        public CollectionPointController(SmartRecyclingDbContext dbContext, IMapper mapper, PointStateService pointService, StatisticsService statisticsService)
        {
            this.dbContext = dbContext;
            _mapper = mapper;
            this.pointService = pointService;
            this.statisticsService = statisticsService;
        }

        [HttpGet]
        public IEnumerable<CollectionPoint> GetCollectionPoints()
        {
            return dbContext.CollectionPoint
                .Include(p => p.CollectionPointComposition)
                .ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CollectionPoint>> GetCollectionPoint(int id)
        {
            var point = await dbContext.CollectionPoint
                .Include(p => p.CollectionPointComposition)
                .Include(p => p.Transportations)
                .FirstOrDefaultAsync(p => p.Id == id);
            return Ok(point);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCollectionPoint(CollectionPointDto collectionPoint)
        {

            var collectionPointMap = _mapper.Map<CollectionPoint>(collectionPoint);

            await dbContext.CollectionPoint.AddAsync(collectionPointMap);
            await dbContext.SaveChangesAsync();

            await pointService.CreatePointComposition(collectionPointMap.Id); 
            await dbContext.SaveChangesAsync();

            return Ok(collectionPoint);
        }

        [HttpPatch]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateCollectionPointPartially(int id, CollectionPointPatchDto collectionPoint)
        {
            var existingPoint = await dbContext.CollectionPoint.FindAsync(id);

            _mapper.Map(collectionPoint, existingPoint);

            dbContext.Entry(existingPoint).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();

            return Ok(collectionPoint);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReport(int pointID, DateOnly startDate, DateOnly endDate)
        {
            var statistics = statisticsService.CreatePointStatistics(pointID, startDate, endDate);
            await dbContext.CollectionPointStatistics.AddAsync(statistics);
            await dbContext.SaveChangesAsync();
            return new FileStreamResult(statisticsService.GetFile(statistics), "application/pdf")
            {
                FileDownloadName = $"report-for:{statistics.Period}.pdf"
            };
        }

        [HttpGet("{id}")]
        public FileStreamResult GetReport(int id)
        {
            var statistics = dbContext.CollectionPointStatistics.FirstOrDefault(p => p.Id == id);
            byte[] pdfBytes = statisticsService.GeneratePdfContent(statistics);
            MemoryStream stream = new MemoryStream(pdfBytes);
            stream.Position = 0;

            return new FileStreamResult(stream, "application/pdf")
            {
                FileDownloadName = $"report-for:{statistics.Period}.pdf"
            };
        }
    }
}