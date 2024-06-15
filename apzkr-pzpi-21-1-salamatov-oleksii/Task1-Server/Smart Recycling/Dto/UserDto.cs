using CORE.Abstractions;
using CORE.Models;

namespace SmartRecycling.Dto
{
    public class UserDto: BaseEntity
    {
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required string Role { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
    }

    public class UserPatchDto
    {
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
    }
}
