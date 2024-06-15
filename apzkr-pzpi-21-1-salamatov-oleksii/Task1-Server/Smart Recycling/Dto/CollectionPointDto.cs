using CORE.Abstractions;
using CORE.Models;

namespace SmartRecycling.Dto
{
    public class CollectionPointDto : BaseEntity
    {
        public required string Location { get; set; }
        public required string Status { get; set; }
        public int Fullness { get; set; }
    }

    public class CollectionPointPatchDto
    {
        public required string Status { get; set; }
        public int Fullness { get; set; }
    }
}
