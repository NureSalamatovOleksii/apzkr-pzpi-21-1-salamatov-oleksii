using CORE.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CORE.Models
{
    public class CollectionPointComposition: BaseEntity
    {
        public required string TrashType { get; set; }
        public int Weight { get; set; } = 0;
        public int Volume { get; set; } = 0;
        public int MaxVolume { get; set; } = 3;
        public int Fullness { get; set; } = 0;
        [ForeignKey(nameof(CollectionPointID))]
        public int CollectionPointID { get; set; }

        public CollectionPoint CollectionPoint { get; set; }
    }
}
