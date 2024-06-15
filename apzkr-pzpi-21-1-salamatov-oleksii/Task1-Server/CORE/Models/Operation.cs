using CORE.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CORE.Models
{
    public class Operation: BaseEntity
    {
        public required string TrashType { get; set; }
        public int Weight { get; set; }
        public int Volume { get; set; }
        public DateTimeOffset Time { get; set; }

        [ForeignKey(nameof(UserID))]
        public int UserID { get; set; }
        [ForeignKey(nameof(CollectionPointID))]
        public int CollectionPointID { get; set; }
        
        public User User { get; set; }
        public CollectionPoint CollectionPoint { get; set; }
    }
}
