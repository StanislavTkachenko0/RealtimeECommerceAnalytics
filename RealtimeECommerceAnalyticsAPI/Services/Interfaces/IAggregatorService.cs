using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Models.Response;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface IAggregatorService
    {
        public Task<AggregatedDataResponse> GetAggregatedDataAsync();
        public Task SendAggregatedDataAsync();
    }
}
