using CORE.Models;
using DAL.Contexts;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class TransportationService: BaseService
    {
        public TransportationService(SmartRecyclingDbContext smartRecyclingDbContext) : base(smartRecyclingDbContext)
        {
        }

        public async void CreateTransportOperation(CollectionPoint collPoint, string trashType)
        {
            var distanceToPoints = new Dictionary<RecyclingPoint, double>();

            var recyclingPoints = dbContext.RecyclingPoint.Where(p => p.RecyclingType == trashType && p.Workload < 90).ToList();

            foreach (var point in recyclingPoints)
            {
                double distance = await GetDistance(string.Join("2C", collPoint.Location.Split(' ')), 
                    string.Join("2C", point.Location.Split(' ')));
                distanceToPoints.Add(point, distance);
            }

            var sortedPoints = distanceToPoints
                .OrderBy(x => x.Value)
                .ThenBy(x => x.Key.Workload)
                .ToDictionary(p => p.Key, p => p.Value);

            Transportation transportation = new()
            {
                TrashType = trashType,
                Weight = collPoint.CollectionPointComposition.FirstOrDefault(x => x.TrashType == trashType).Weight,
                Status = "In Progress",
                CollectionPointID = collPoint.Id,
                RecyclingPointID = sortedPoints.First().Key.Id,
            };

            await dbContext.Transportation.AddAsync(transportation);
            await dbContext.SaveChangesAsync();
        }

        public async Task<double> GetDistance(string coordinate, string coordinate2)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    string apiUrl = $"https://api.mapbox.com/directions/v5/mapbox/driving/{coordinate}" +
                        $"%3B{coordinate2}?alternatives=false&annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&notifications=none&access_token=pk.eyJ1Ijoib2xla3NpeXkiLCJhIjoiY2x2ejQ3am9wMWJ0dTJrb2dqMmtoMzVzNSJ9.poCEnt5lJRlocbukSzazZQ";

                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();

                        var apiResponse = JsonConvert.DeserializeObject<ApiResponse>(responseBody);
                        return apiResponse.Routes[0].Distance;
                    }
                    else
                    {
                        Console.WriteLine($"Failed to retrieve data. Status code: {response.StatusCode}");
                    }
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine($"An error occurred: {e.Message}");
                }
            }

            return 0.0;
        }

        public class ApiResponse
        {
            public Route[] Routes { get; set; }
        }

        public class Route
        {
            public double Distance { get; set; }
        }
    }
}
