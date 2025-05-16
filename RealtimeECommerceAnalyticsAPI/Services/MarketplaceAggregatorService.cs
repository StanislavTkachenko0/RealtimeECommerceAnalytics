using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services
{
    public class MarketplaceAggregatorService : IMarketplaceAggregatorService
    {
        private readonly IEnumerable<IMarketplaceService> _marketplaceServices;

        public MarketplaceAggregatorService(IEnumerable<IMarketplaceService> marketplaceServices)
        {
            _marketplaceServices = marketplaceServices;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var allTasks = _marketplaceServices.Select(s => s.GetProductsAsync());
            var results = await Task.WhenAll(allTasks);
            return results.SelectMany(x => x);
        }
    }
}
