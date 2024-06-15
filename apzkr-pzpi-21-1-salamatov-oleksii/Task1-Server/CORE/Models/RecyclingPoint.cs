using CORE.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CORE.Models
{
    public class RecyclingPoint: BaseEntity
    {
        public required string Name { get; set; }
        public required string Location { get; set; }
        public required string RecyclingType { get; set; }
        public int Capacity { get; set; }
        public int ProcessingTrash { get; set; }
        public int QueuedTrash { get; set; }
        public int Workload { get; set; }

        public ICollection<Transportation> Transportation { get; set; }
        public ICollection<CollectionPointStatistics> RecyclingPointStatistics { get; set; }
    }
}
