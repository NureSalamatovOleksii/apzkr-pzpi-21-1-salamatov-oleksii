using iTextSharp.text.pdf;
using iTextSharp.text;
using Document = iTextSharp.text.Document;
using DAL.Contexts;
using CORE.Models;
using System.Web.Mvc;

namespace BLL.Services
{
    public class StatisticsService: BaseService
    {
        public StatisticsService(SmartRecyclingDbContext smartRecyclingDbContext) : base(smartRecyclingDbContext)
        {
        }

        public CollectionPointStatistics CreatePointStatistics(int point, DateOnly startDate, DateOnly endDate)
        {

            var operations = dbContext.Operation
                .Where(o => o.CollectionPointID == point
                            && o.Time.Date >= startDate.ToDateTime(new TimeOnly(0, 0))
                            && o.Time.Date <= endDate.ToDateTime(new TimeOnly(0, 0)))
                .ToList();

            CollectionPointStatistics collectionPointStatistics = new()
            {
                Collected = 52,//operations.Sum(o => o.Weight),
                Recycled = 52,
                MostCollectedType = "plastic", /*operations
                    .GroupBy(o => o.TrashType)
                    .OrderByDescending(g => g.Sum(o => o.Weight))
                    .Select(g => g.Key)
                    .FirstOrDefault(),*/
                Attendance = 6, //operations.Select(o => o.UserID).Distinct().Count(),
                Period = startDate.ToString() + '-' + endDate.ToString(),
                CollectionPointID = point
            };

            return collectionPointStatistics;
        }


        public byte[] GeneratePdfContent(CollectionPointStatistics pointStatistics)
        {

            using (var ms = new MemoryStream())
            {
                using (var doc = new Document())
                {
                    PdfWriter.GetInstance(doc, ms);
                    doc.Open();
                    doc.Add(new Paragraph($"Report №{pointStatistics.Id}"));
                    doc.Add(new Paragraph($"Point Id: {pointStatistics.CollectionPointID}"));
                    doc.Add(new Paragraph($"Period: {pointStatistics.Period}"));
                    doc.Add(new Paragraph($"Collected: {pointStatistics.Collected}"));
                    doc.Add(new Paragraph($"Recycled: {pointStatistics.Recycled}"));
                    doc.Add(new Paragraph($"Most Collected Type: {pointStatistics.MostCollectedType}"));
                    doc.Add(new Paragraph($"Attendance: {pointStatistics.Attendance}"));
                    doc.Close();
                }
                return ms.ToArray();
            }
        }

        public async void UpdateUserStatistics(Operation operation)
        {
            var statistics = await dbContext.UserStatistics.FindAsync(operation.UserID);
            statistics.Recycled += operation.Weight;
            Dictionary<string, double> bonusRate = new Dictionary<string, double>()
            {
                { "glass", 0.05 },
                { "plastic", 0.03 },
                { "paper", 0.02 },
                { "metal", 0.08 }
            };

            statistics.Bonuses += Convert.ToInt32(Math.Round(operation.Weight * bonusRate[operation.TrashType]));
            await dbContext.SaveChangesAsync();
        }

        public MemoryStream GetFile(CollectionPointStatistics statistics)
        {
            byte[] pdfBytes = GeneratePdfContent(statistics);
            MemoryStream stream = new MemoryStream(pdfBytes);
            stream.Position = 0;
            return stream;
        }
    }
}
