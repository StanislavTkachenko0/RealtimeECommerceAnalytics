using RealtimeECommerceAnalytics.Models.DTOs;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface IAggregatorService
    {
        public Task<IEnumerable<ProductDto>> GetAggregatedDataAsync();
    }
}
