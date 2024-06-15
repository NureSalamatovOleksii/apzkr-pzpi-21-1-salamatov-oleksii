namespace SmartRecycling.Dto
{
    public class RecyclingPointDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string RecyclingType { get; set; }
        public int Capacity { get; set; }
        public int QueuedTrash { get; set; }
        public int Workload { get; set; }
    }
}
