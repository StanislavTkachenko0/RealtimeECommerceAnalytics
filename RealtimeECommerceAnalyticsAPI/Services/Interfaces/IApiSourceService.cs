using RealtimeECommerceAnalytics.Models.DTOs;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface IApiSourceService
    {
        string SourceName { get; }
        Task<IEnumerable<ProductDto>> GetLatestDataAsync();
    }
}
