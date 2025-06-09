using Microsoft.AspNetCore.SignalR;
using RealtimeECommerceAnalytics.HUBs;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services
{
    public class MarketplaceService
    {
        private readonly IAggregatorService _aggregatorService;

        public MarketplaceService(
            IAggregatorService aggregatorService
            )
        {
            _aggregatorService = aggregatorService;
        }

        public async Task AggregateAndBroadcastProductStatsAsync()
        {
            var allProducts = await _aggregatorService.GetAggregatedDataAsync();

            // Агрегація: середня ціна по категоріях
            var aggregatedStats = allProducts
                .GroupBy(p => p.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    AveragePrice = Math.Round(g.Average(p => p.Price ?? 0), 2),
                    Count = g.Count()
                })
                .ToList();
        }
    }
}
