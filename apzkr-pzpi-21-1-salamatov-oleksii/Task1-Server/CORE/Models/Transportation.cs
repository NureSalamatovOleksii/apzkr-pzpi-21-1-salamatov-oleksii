using CORE.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CORE.Models
{
    public class Transportation: BaseEntity
    {
        public required string TrashType { get; set; }
        public int Weight { get; set; }
        public string Status { get; set; }

        [ForeignKey(nameof(CollectionPointID))]
        public int CollectionPointID { get; set; }
        [ForeignKey(nameof(RecyclingPointID))]
        public int RecyclingPointID { get; set; }

        public CollectionPoint CollectionPoint { get; set; }
        public RecyclingPoint RecyclingPoint { get; set; }
    }
}
