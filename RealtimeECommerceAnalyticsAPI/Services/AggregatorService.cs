using Microsoft.AspNetCore.SignalR;
using RealtimeECommerceAnalytics.HUBs;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using RealtimeECommerceAnalytics.Services.Mongo;

namespace RealtimeECommerceAnalytics.Services
{
    public class AggregatorService : IAggregatorService
    {
        private readonly IEnumerable<IApiSourceService> _sources;
        private readonly MongoDataService _mongo;
        private readonly IHubContext<AnalyticsHub> _hubContext;

        public AggregatorService(
            IEnumerable<IApiSourceService> sources,
            MongoDataService mongo,
            IHubContext<AnalyticsHub> hubContext
            )
        {
            _sources = sources;
            _mongo = mongo;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<ProductDto>> GetAggregatedDataAsync()
        {
            try
            {
                var tasks = _sources.Select(src => src.GetLatestDataAsync());
                var results = await Task.WhenAll(tasks);
                var aggregated = results.SelectMany(r => r).ToList();

                // await _mongo.SaveManyAsync(aggregated);

                return aggregated;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task SendAggregatedDataAsync()
        {
            await _hubContext.Clients.All.SendAsync("dataUpdated");
        }
    }
}
