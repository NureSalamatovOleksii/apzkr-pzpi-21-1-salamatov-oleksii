using CORE.Abstractions;
using CORE.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRecycling.Dto
{
    public class TransportationDto: BaseEntity
    {
        public required string TrashType { get; set; }
        public int Weight { get; set; }
        public string Status { get; set; }
        public int CollectionPointID { get; set; }
        public int RecyclingPointID { get; set; }
    }
}
