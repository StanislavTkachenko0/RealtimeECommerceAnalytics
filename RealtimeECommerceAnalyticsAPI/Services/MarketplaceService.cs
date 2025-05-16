using Microsoft.AspNetCore.SignalR;
using RealtimeECommerceAnalytics.HUBs;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services
{
    public class MarketplaceService
    {
        private readonly IHubContext<MarketplaceHub> _hubContext;
        private readonly IMarketplaceAggregatorService _marketplaceAggregatorService;

        public MarketplaceService(
            IHubContext<MarketplaceHub> hubContext,
            IMarketplaceAggregatorService marketplaceAggregatorService
            )
        {
            _hubContext = hubContext;
            _marketplaceAggregatorService = marketplaceAggregatorService;
        }

        public async Task AggregateAndBroadcastProductStatsAsync()
        {
            var allProducts = await _marketplaceAggregatorService.GetAllProductsAsync();

            // Агрегація: середня ціна по категоріях
            var aggregatedStats = allProducts
                .GroupBy(p => p.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    AveragePrice = Math.Round(g.Average(p => p.Price), 2),
                    Count = g.Count()
                })
                .ToList();

            // Відправка через SignalR
            await _hubContext.Clients.All.SendAsync("ReceiveProductStats", aggregatedStats);
        }
    }
}
