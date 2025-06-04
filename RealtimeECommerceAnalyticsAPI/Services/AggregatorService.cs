using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using RealtimeECommerceAnalytics.Services.Mongo;

namespace RealtimeECommerceAnalytics.Services
{
    public class AggregatorService : IAggregatorService
    {
        private readonly IEnumerable<IApiSourceService> _sources;
        private readonly MongoDataService _mongo;

        public AggregatorService(
            IEnumerable<IApiSourceService> sources,
            MongoDataService mongo
            )
        {
            _sources = sources;
            _mongo = mongo;
        }

        public async Task<IEnumerable<ProductDto>> GetAggregatedDataAsync()
        {
            var tasks = _sources.Select(src => src.GetLatestDataAsync());
            var results = await Task.WhenAll(tasks);
            var aggregated = results.SelectMany(r => r).ToList();

            await _mongo.SaveManyAsync(aggregated);

            return aggregated;
        }
    }
}
