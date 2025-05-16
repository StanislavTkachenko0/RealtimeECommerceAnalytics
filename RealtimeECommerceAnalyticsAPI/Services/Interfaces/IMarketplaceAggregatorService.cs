using RealtimeECommerceAnalytics.Models.DTOs;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface IMarketplaceAggregatorService
    {
        public Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    }
}
