using AutoMapper;
using BLL.Services;
using CORE.Models;
using DAL.Contexts;
//using iTextSharp.text.pdf.qrcode;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecycling.Dto;
using System.Drawing;
using QRCoder;
using DAL;

namespace SmartRecycling.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UserController : Controller
    {
        private readonly SmartRecyclingDbContext dbContext;
        private readonly IMapper _mapper;

        public UserController(SmartRecyclingDbContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<User> GetUsers()
        {
            return dbContext.User
                .Include(u => u.UserStatistics)
                .Include(u => u.Operations)
                .ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                IQueryable<User> query = dbContext.User
                    .Include(u => u.UserStatistics)
                    .Include(u => u.Operations);

                var user = await query.FirstOrDefaultAsync(c => c.Id == id);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto user)
        {
            var existingUser = await dbContext.User.Where(u => u.Email == user.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                ModelState.AddModelError("", "User with such email already exists");
                return StatusCode(422, ModelState);
            }

            var userMap = _mapper.Map<User>(user);
            userMap.Password = AuthService.HashPassword(userMap.Password);
            await dbContext.User.AddAsync(userMap);
            await dbContext.SaveChangesAsync();

            if (userMap.Role != "Admin")
            {
                UserStatistics userStatistics = new()
                {
                    Id = userMap.Id,
                    Recycled = 0,
                    Bonuses = 0
                };

                userMap.UserStatistics = userStatistics;
                await dbContext.UserStatistics.AddAsync(userStatistics);
                await dbContext.SaveChangesAsync();
            }
            //userMap.ConfirmationCode = EmailSenderHelper.SendConfirmation("alexeyfromov@gmail.com", user.Password, "oleksiy.salamatov@nure.ua");

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser([FromRoute] int id, [FromBody] UserDto updatedUserDto)
        {
            if (updatedUserDto == null || id != updatedUserDto.Id)
                return BadRequest(ModelState);

            var existingUser = await dbContext.User.FindAsync(id);

            if (existingUser == null)
                return NotFound();

            _mapper.Map(updatedUserDto, existingUser);

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!dbContext.User.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPatch]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateUsertPartially(int id, UserPatchDto user)
        {
            var existingUser = await dbContext.User.FindAsync(id);

            _mapper.Map(user, existingUser);

            dbContext.Entry(existingUser).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var userToDelete = await dbContext.User.FindAsync(id);
            if (userToDelete == null) 
                return NotFound();

            dbContext.User.Remove(userToDelete);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{userId}")]
        public ActionResult GenerateQRCode(int userId)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode($"User Id: {userId}", QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
            byte[] qrCodeImage = qrCode.GetGraphic(20);
            return File(qrCodeImage, "image/png");
        }
    }
}
