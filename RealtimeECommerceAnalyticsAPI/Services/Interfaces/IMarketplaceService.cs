using RealtimeECommerceAnalytics.Models.DTOs;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface IMarketplaceService
    {
        Task<IEnumerable<ProductDto>> GetProductsAsync();
    }
}
