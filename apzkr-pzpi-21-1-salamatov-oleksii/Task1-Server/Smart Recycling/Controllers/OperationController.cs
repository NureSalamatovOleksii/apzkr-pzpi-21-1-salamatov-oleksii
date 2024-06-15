using AutoMapper;
using BLL.Services;
using CORE.Models;
using DAL.Contexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRecycling.Dto;

namespace SmartRecycling.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize(Roles = "Admin")]
    //[AllowAnonymous]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class OperationController : Controller
    {
        private readonly SmartRecyclingDbContext dbContext;
        private readonly IMapper _mapper;
        private readonly PointStateService pointStateService;
        private readonly StatisticsService statisticsService;

        public OperationController(SmartRecyclingDbContext dbContext, IMapper mapper, PointStateService pointStateService, StatisticsService statisticsService)
        {
            this.dbContext = dbContext;
            _mapper = mapper;
            this.pointStateService = pointStateService;
            this.statisticsService = statisticsService;
        }

        [HttpGet]
        public IEnumerable<Operation> GetOperations()
        {
            List<Operation> operations = dbContext.Operation.ToList();
            return operations;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOperation(OperationDto operation)
        {
            var operationrMap = _mapper.Map<Operation>(operation);
            operationrMap.Time = DateTimeOffset.Now;

            await dbContext.Operation.AddAsync(operationrMap);
            await dbContext.SaveChangesAsync();

            pointStateService.UpdateCollectionPointState(operationrMap);
            statisticsService.UpdateUserStatistics(operationrMap);

            return Ok(operation);
        }
    }
}
