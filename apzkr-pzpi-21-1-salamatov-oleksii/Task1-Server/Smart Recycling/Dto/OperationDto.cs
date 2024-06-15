using CORE.Abstractions;
using CORE.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRecycling.Dto
{
    public class OperationDto : BaseEntity
    {
        public required string TrashType { get; set; }
        public int Weight { get; set; }
        public int Volume { get; set; }
        public DateTimeOffset Time { get; set; }
        public int UserID { get; set; }
        public int CollectionPointID { get; set; }
    }
}
