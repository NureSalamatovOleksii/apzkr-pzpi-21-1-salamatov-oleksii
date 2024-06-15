using AutoMapper;
using DAL.Contexts;
using Microsoft.AspNetCore.Mvc;

namespace SmartRecycling.Controllers
{
    public class BaseController : Controller
    {
        public readonly SmartRecyclingDbContext dbContext;
        public readonly IMapper _mapper;

        public BaseController(SmartRecyclingDbContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            _mapper = mapper;
        }
    }
}
