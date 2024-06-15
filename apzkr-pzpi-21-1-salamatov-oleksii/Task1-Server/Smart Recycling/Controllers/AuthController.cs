using BLL.Services;
using CORE.Helpers;
using CORE.Models;
using DAL.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace SmartRecycling.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : Controller
    {
        private SmartRecyclingDbContext dbContext;
        private readonly AuthService authService;
        public AuthController(SmartRecyclingDbContext dbContext, AuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
        }

        [HttpPost("/token")]
        public IActionResult Token(string email, string password)
        {
            //EmailSenderHelper.SendConfirmation("alexeyfromov@gmail.com", /*dbContext.User.First().Password,*/ "oleksiy.salamatov@nure.ua");

            var identity = authService.GetIdentity(email, password);
            if (identity == null)
            {
                return BadRequest(new { errorText = "Invalid username or password." });
            }

            if (!AuthService.VerifyHashedPassword(dbContext.User.FirstOrDefault(u => u.Email == email).Password, password))
            {
                return BadRequest(new { errorText = "Invalid password." });
            }

            if (!dbContext.User.FirstOrDefault(u => u.Email == email).IsEmailConfirmed)
            {
                return BadRequest("Email is not confirmed");
            }

            return Json(authService.GetResponse(email, password, identity));
        }

        [HttpPost("{id}/{code}")]
        public async Task<IActionResult> ConfirmCode(int id, string code)
        {
            var user = dbContext.User.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound(); // User not found
            }

            if (user.ConfirmationCode == code)
            {
                user.IsEmailConfirmed = true;
                await dbContext.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest("Invalid confirmation code");
            }
        }
    }
}
