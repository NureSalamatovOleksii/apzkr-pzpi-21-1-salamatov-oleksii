using CORE.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CORE.Models
{
    public class CollectionPointStatistics: BaseEntity
    {
        public int Collected { get; set; }
        public int Recycled { get; set; }
        public string? MostCollectedType { get; set; }
        public int Attendance { get; set; }
        public required string Period { get; set; }
        [ForeignKey(nameof(CollectionPointID))]
        public int CollectionPointID { get; set; }

        public CollectionPoint CollectionPoint { get; set; }
    }
}
